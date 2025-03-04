import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FriendCard from "../components/FriendCard";
import { getUserInterests } from "../api/user";
import { useAlerts } from "../providers/AlertProvider";

jest.mock("../api/user", () => ({
    getUserInterests: jest.fn()
}));

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn()
}));

const mockAlerts = {
    error: jest.fn(),
    info: jest.fn()
};

const mockFriend = {
    id: "1",
    username: "edfournier@umass.edu",
    displayName: "Eric Fournier"
};

const mockUserInterests = [
    { code: "CS187", name: "DSA" },
    { code: "CS220", name: "Marius Class" }
];

const mockOnClose = jest.fn();
const mockOnUnfriend = jest.fn();

describe("FriendCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAlerts.mockReturnValue(mockAlerts);
    });

    test("renders friend's interests and highlights common ones", async () => {
        getUserInterests.mockResolvedValue([
            { code: "CS220", name: "Marius Class" },
            { code: "CS230", name: "Joe's Class" }
        ]);

        render(
            <FriendCard
                friend={mockFriend}
                userInterests={mockUserInterests}
                onClose={mockOnClose}
                onUnfriend={mockOnUnfriend}
            />
        );

        // Check for common interests highlighting
        await waitFor(() => screen.getByText("Marius Class"));
        expect(screen.getByText("Marius Class")).toHaveClass("text-indigo-500");
        expect(screen.getByText("Joe's Class")).toHaveClass("text-indigo-200");
    });

    test("displays error when failed to fetch friend's interests", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        getUserInterests.mockRejectedValue(new Error("Mock error"));

        render(
            <FriendCard
                friend={mockFriend}
                userInterests={mockUserInterests}
                onClose={mockOnClose}
                onUnfriend={mockOnUnfriend}
            />
        );

        // Error handler should be called on server failure
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
        consoleErrorSpy.mockRestore();
    });
});
