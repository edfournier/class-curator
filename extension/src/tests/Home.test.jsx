import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/Home";
import { getUserDetails, putUserDetails } from "../api/user";
import { getRecommendations } from "../api/recommendations";
import { useAlerts } from "../providers/AlertProvider";

jest.mock("../api/user", () => ({
    getUserDetails: jest.fn(),
    putUserDetails: jest.fn(),
}));

jest.mock("../api/recommendations", () => ({
    getRecommendations: jest.fn(),
}));

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn(),
}));

const mockAlerts = { 
    error: jest.fn(), 
    info: jest.fn() 
};

useAlerts.mockReturnValue(mockAlerts);

const mockUserDetails = {
    major: "Computer Science",
    minor: "Linguistics",
    gradSession: { year: 2025, semester: "SPRING" },
    tags: "AI,Data Science",
};

const mockRecommendations = {
    tags: [],
    friends: [{ course: { code: "COMPSCI 589" }, networkCount: 1 }],
    peers: [{ course: { code: "COMPSCI 687" }, networkCount: 2 }]
};

describe("Home", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.clearAllMocks();
    });

    test("shows error when failing to load user details", async () => {
        getUserDetails.mockRejectedValue(new Error("Mock failure"));
        render(<Home />);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
    });

    test("handles form input change", () => {
        render(<Home />);
        const majorInput = screen.getByLabelText("Major");
        fireEvent.change(majorInput, { target: { value: "Comp E" } });
        expect(majorInput.value).toBe("Comp E");
    });

    test("adds and removes tags", () => {
        render(<Home />);
        const input = screen.getByPlaceholderText("Enter a tag describing your interests...");
        fireEvent.change(input, { target: { value: "Machine Learning" } });

        const addButton = screen.getByLabelText("add-tag");
        fireEvent.click(addButton);
        expect(screen.getByText("Machine Learning")).toBeInTheDocument();

        const removeButton = screen.getByText("Machine Learning").parentElement.querySelector("svg");
        fireEvent.click(removeButton);
        expect(screen.queryByText("Machine Learning")).not.toBeInTheDocument();
    });

    test("errors on duplicate tags", () => {
        render(<Home />);
        const input = screen.getByPlaceholderText("Enter a tag describing your interests...");
        const addButton = screen.getByLabelText("add-tag");

        fireEvent.change(input, { target: { value: "Machine Learning" } });
        fireEvent.click(addButton);
        expect(screen.getByText("Machine Learning")).toBeInTheDocument();

        fireEvent.change(input, { target: { value: "Machine Learning" } });
        fireEvent.click(addButton);
        expect(mockAlerts.error).toHaveBeenCalled();
    });

    test("saves user details and handles success", async () => {
        getUserDetails.mockResolvedValue(mockUserDetails);
        putUserDetails.mockResolvedValue({}); 
        render(<Home />);

        const input = screen.getByPlaceholderText("Enter a tag describing your interests...");
        fireEvent.change(input, { target: { value: "New Tag" } });
        fireEvent.click(screen.getByLabelText("add-tag"));
        
        const submitButton = screen.getByText("Save Changes");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockAlerts.info).toHaveBeenCalled());
    });

    test("handles no tags case", async () => {
        getUserDetails.mockResolvedValue({
            major: "Computer Science",
            minor: "Linguistics",
            gradSession: { year: 2025, semester: "SPRING" },
            tags: "",
        });
        render(<Home />);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledTimes(0));
    });

    test("handles save with no changes", async () => {
        render(<Home />);
        
        const submitButton = screen.getByText("Save Changes");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockAlerts.info).toHaveBeenCalledTimes(0));
    });

    test("saves user details and handles error", async () => {
        getUserDetails.mockResolvedValue(mockUserDetails);
        putUserDetails.mockRejectedValue(new Error("Mock error")); 
        render(<Home />);
    
        const input = screen.getByPlaceholderText("Enter a tag describing your interests...");
        fireEvent.change(input, { target: { value: "New Tag" } });
        fireEvent.click(screen.getByLabelText("add-tag"));
        
        const submitButton = screen.getByText("Save Changes");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
    })

    test("shows error on saving user details", async () => {
        getUserDetails.mockResolvedValue(mockUserDetails);
        putUserDetails.mockRejectedValue(new Error("Mock error"));
        render(<Home />);

        const input = screen.getByPlaceholderText("Enter a tag describing your interests...");
        fireEvent.change(input, { target: { value: "New Tag" } });
        fireEvent.click(screen.getByLabelText("add-tag"));
        
        const submitButton = screen.getByText("Save Changes");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
    });

    test("fetches recommendations and displays them", async () => {
        getRecommendations.mockResolvedValue(mockRecommendations);
        render(<Home />);

        const button = screen.getByText("Get Recommendations!");
        fireEvent.click(button);
        await waitFor(() => expect(screen.getByText("COMPSCI 687")).toBeInTheDocument());
    });

    test("shows error when failing to fetch recommendations", async () => {
        getRecommendations.mockRejectedValue(new Error("Mock failure"));
        render(<Home />);

        const button = screen.getByText("Get Recommendations!");
        fireEvent.click(button);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
    });

});