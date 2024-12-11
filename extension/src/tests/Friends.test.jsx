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

describe("Friends", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        useAlerts.mockReturnValue(mockAlerts);
        getFriends.mockResolvedValue([{ id: 2, username: "edfournier@umass.edu", displayName: "Eric Fournier" }, { id: 2, username: "hseth@umass.edu", displayName: "Harsh Seth" }]);
        getIncomingRequests.mockResolvedValue([{ id: 1, username: "lgates@umass.edu" }]);
        getCurrentUserInterests.mockResolvedValue([{ code: "CS 121", name: "Programming" }, { code: "CS 187", name: "DSA" }]);
        getUserInterests.mockResolvedValue([{ code: "CS 121", name: "Programming" }, { code: "CS 345", name: "Databases" },]);
        postFriendRequest.mockResolvedValue();
        postRequestDecision.mockResolvedValue();
        deleteFriend.mockResolvedValue();
    });

    test("handles denying friend requests", async () => {
        render(<Friends />);
    
        // Deny friend request
        await waitFor(() => expect(screen.getByLabelText("deny")).toBeInTheDocument());
        fireEvent.click(screen.getByLabelText("deny"));
        await waitFor(() => expect(postRequestDecision).toHaveBeenCalledWith(1, false));
    });

    test("handles accepting friend requests", async () => {
        render(<Friends />);
    
        // ACcept friend request
        await waitFor(() => expect(screen.getByLabelText("accept")).toBeInTheDocument());
        fireEvent.click(screen.getByLabelText("accept"));
        await waitFor(() => expect(postRequestDecision).toHaveBeenCalledWith(1, true));
    });
    
    test("handles errors when sending friend request", async () => {
        postFriendRequest.mockRejectedValue(new Error("Mock error"));
        render(<Friends />);
    
        // Attempt to add friend
        const input = screen.getByPlaceholderText("Enter a UMass email address...");
        fireEvent.change(input, { target: { value: "test@umass.edu" } });
        fireEvent.click(screen.getByLabelText("send"));
    
        // Wait for the error alert to be triggered
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Failed to send friend request"));
    });

    test("handles errors when responding to friend requests", async () => {
        postRequestDecision.mockRejectedValue(new Error("Mock error"));
        render(<Friends />);
    
        // Click accept on the first friend request
        await waitFor(() => expect(screen.getByLabelText("accept")).toBeInTheDocument());
        fireEvent.click(screen.getByLabelText("accept"));
        await waitFor(() => {
            expect(mockAlerts.error).toHaveBeenCalledWith("Failed to respond to request, please try again");
        });
    });

    test("handles opening and close card view", async () => {    
        render(<Friends />);
    
        // Select a friend and then close out
        await waitFor(() => expect(screen.getByLabelText("accept")).toBeInTheDocument());
        fireEvent.click(screen.getByText("Eric Fournier"));
        fireEvent.click(screen.getByLabelText("close"));
    
        // Should be back on requests page
        await waitFor(() => expect(screen.getByText("Harsh Seth")).toBeInTheDocument());
    });

    test("handles errors when unfriending a friend", async () => {
        // Mock the error when deleting a friend
        deleteFriend.mockRejectedValue(new Error("Mock error"));
    
        render(<Friends />);
    
        // Select a friend and click "Unfriend"
        await waitFor(() => expect(screen.getByLabelText("accept")).toBeInTheDocument());
        fireEvent.click(screen.getByText("Eric Fournier"));
        fireEvent.click(screen.getByText("Unfriend"));
    
        // Wait for the error alert to be shown
        await waitFor(() => {
            expect(mockAlerts.error).toHaveBeenCalledWith("Failed to unfriend, please try again");
        });
    });

    test("renders and handles friend interactions", async () => {
        render(<Friends />);

        // Test sending a friend request
        const input = screen.getByPlaceholderText("Enter a UMass email address...");
        fireEvent.change(input, { target: { value: "test@umass.edu" } });
        fireEvent.click(screen.getByLabelText("send"));
        await waitFor(() => expect(postFriendRequest).toHaveBeenCalledWith("test@umass.edu"));
        expect(mockAlerts.info).toHaveBeenCalledWith("Sent request to test@umass.edu!");

        // Test unfriending
        fireEvent.click(screen.getByText("Eric Fournier")); // Select friend
        fireEvent.click(screen.getByText("Unfriend"));
        await waitFor(() => expect(deleteFriend).toHaveBeenCalledWith(2));
        expect(mockAlerts.info).toHaveBeenCalledWith("Unfriended edfournier@umass.edu!");
    });

    test("handles errors on initial load", async () => {
        getFriends.mockRejectedValue(new Error("Mock error"));
        getIncomingRequests.mockRejectedValue(new Error("Mock error"));
        render(<Friends />);
        await waitFor(() => {
            expect(mockAlerts.error).toHaveBeenCalledWith("Failed to load user's friends");
        });
    });

    test("handles invalid friend request input", async () => {
        render(<Friends />);

        const input = screen.getByPlaceholderText("Enter a UMass email address...");
        fireEvent.change(input, { target: { value: "" } });
        fireEvent.click(screen.getByLabelText("send"));

        // Ensure API isn't called for empty input
        expect(postFriendRequest).not.toHaveBeenCalled();
        expect(mockAlerts.error).toHaveBeenCalledWith("Please enter a valid UMass email, e.g. edfournier@umass.edu");

        fireEvent.change(input, { target: { value: "invalid-email" } });
        fireEvent.click(screen.getByLabelText("send"));

        // Ensure API isn't called for invalid email
        expect(postFriendRequest).not.toHaveBeenCalled();
        expect(mockAlerts.error).toHaveBeenCalledWith("Please enter a valid UMass email, e.g. edfournier@umass.edu");
    });

});