import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Friends from "../pages/Friends";
import { useAlerts } from "../providers/AlertProvider";
import {
  deleteFriend,
  getFriends,
  getIncomingRequests,
  postFriendRequest,
  postRequestDecision
} from "../api/friends";
import { getCurrentUserInterests, getUserInterests } from "../api/user";

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn()
}));

jest.mock("../api/friends", () => ({
    deleteFriend: jest.fn(),
    getFriends: jest.fn(),
    getIncomingRequests: jest.fn(),
    postFriendRequest: jest.fn(),
    postRequestDecision: jest.fn()
}));

jest.mock("../api/user", () => ({
    getCurrentUserInterests: jest.fn(),
    getUserInterests: jest.fn()
}));

const mockAlerts = {
    info: jest.fn(),
    error: jest.fn()
};

useAlerts.mockReturnValue(mockAlerts);

getFriends.mockResolvedValue([
    { id: 2, username: "edfournier@umass.edu", displayName: "Eric Fournier" },
    { id: 3, username: "hseth@umass.edu", displayName: "Harsh Seth" }
]);

getIncomingRequests.mockResolvedValue([
    { id: 1, username: "lgates@umass.edu" }
]);

getCurrentUserInterests.mockResolvedValue([
    { code: "CS 121", name: "Programming" },
    { code: "CS 187", name: "DSA" },
]);

getUserInterests.mockResolvedValue([
    { code: "CS 121", name: "Programming" },
    { code: "CS 345", name: "Databases" },
]);

postFriendRequest.mockResolvedValue();

postRequestDecision.mockResolvedValue();

deleteFriend.mockResolvedValue();


describe("Friends", () => {
    test("renders and handles friend interactions", async () => {
        render(<Friends />);

        // Load intial friends correctly
        waitFor(() => (screen.getByText("Eric Fournier")).toBeInTheDocument());
        waitFor(() => (screen.getByText("Harsh Seth")).toBeInTheDocument());

        // Test sending a friend request
        const input = screen.getByPlaceholderText("Enter a UMass email address...");
        fireEvent.change(input, { target: { value: "test@umass.edu" } });
        fireEvent.click(screen.getByLabelText("send"));

        await waitFor(() => expect(postFriendRequest).toHaveBeenCalledWith("test@umass.edu"));
        expect(mockAlerts.info).toHaveBeenCalledWith("Sent request to test@umass.edu!");

        // Test accepting a friend request
        fireEvent.click(screen.getByLabelText("accept"));

        await waitFor(() => expect(postRequestDecision).toHaveBeenCalledWith(1, true));
        expect(mockAlerts.info).toHaveBeenCalledWith("Added lgates@umass.edu!");

        // Test unfriending
        fireEvent.click(screen.getByText("Eric Fournier")); // Select friend
        fireEvent.click(screen.getByText("Unfriend"));

        await waitFor(() => expect(deleteFriend).toHaveBeenCalledWith(2));
        expect(mockAlerts.info).toHaveBeenCalledWith("Unfriended edfournier@umass.edu!");
    });
});
