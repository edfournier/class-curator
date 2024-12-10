import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FriendCard from "../components/FriendCard";
import { getUserInterests } from "../api/user";
import { useAlerts } from "../providers/AlertProvider";

jest.mock("../api/user", () => ({
    getUserInterests: jest.fn(),
}));

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn(),
}));

const mockAlerts = { 
    error: jest.fn(), 
    info: jest.fn() 
};

useAlerts.mockReturnValue(mockAlerts);

const mockFriend = {
    id: "123",
    email: "friend@example.com",
    name: "John Doe",
};

const mockUserInterests = [
    { code: "CS101", name: "Intro to Computer Science" },
    { code: "CS102", name: "Data Structures" },
];

const mockOnClose = jest.fn();
const mockOnUnfriend = jest.fn();

describe("FriendCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders friend's interests and highlights common ones", async () => {
        getUserInterests.mockResolvedValue([
            { code: "CS101", name: "Intro to Computer Science" },
            { code: "CS103", name: "Algorithms" },
        ]);

        render(
            <FriendCard
                friend={mockFriend}
                userInterests={mockUserInterests}
                onClose={mockOnClose}
                onUnfriend={mockOnUnfriend}
            />
        );

        await waitFor(() => screen.getByText("Intro to Computer Science"));
        expect(screen.getByText("Intro to Computer Science")).toHaveClass("text-indigo-500");
        expect(screen.getByText("Algorithms")).toHaveClass("text-indigo-200");
    });

    test("displays error when failed to fetch friend's interests", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        getUserInterests.mockRejectedValue(new Error("Failed to get friend's interests"));

        render(
            <FriendCard
                friend={mockFriend}
                userInterests={mockUserInterests}
                onClose={mockOnClose}
                onUnfriend={mockOnUnfriend}
            />
        );

        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Failed to get friend's interests"));
        consoleErrorSpy.mockRestore();
    });
});