import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Courses from "../pages/Courses";
import { getCourseDetails, getCourseInsights, getCourseResults } from "../api/courses";
import { useAlerts } from "../providers/AlertProvider";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../api/courses", () => ({
    getCourseResults: jest.fn(),
    getCourseDetails: jest.fn(),
    getCourseInsights: jest.fn()
}));

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn(),
}));


jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useLocation: jest.fn()
    };
});

const mockAlerts = { 
    error: jest.fn(), 
    info: jest.fn() 
};

const mockRedirect = { code: "CS187", name: "Data Structures" };

describe("Courses", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        useAlerts.mockReturnValue(mockAlerts);
        getCourseResults.mockResolvedValue([
            { name: "Data Structures", code: "CS187", id: 1 },
        ]);
        getCourseDetails.mockResolvedValue({
            details: { id: 1, name: "Data Structures", code: "CS 187", description: "Desc" }, upvotes: 10, dislikes: 0,
        });
        getCourseInsights.mockResolvedValue({
            ratingsHistory: [{ semester: "FALL", year: 2019, helpfulness: 1.2, difficulty: 2.2 }]
        });
    });

    
    test("handles redirection with a preselected course", async () => {    
        // Mock `useLocation` to return a value once and then null
        const mockUseLocation = require("react-router-dom").useLocation;
        mockUseLocation
            .mockImplementationOnce(() => ({ state: { course: mockRedirect } }))
            .mockImplementation(() => ({ state: null })); // Return null after the first call
    
        render(<Router><Courses /></Router>);
    
        // Check that the query and results are pre-filled with the redirected course
        waitFor(() => expect(screen.getByDisplayValue("CS187")).toBeInTheDocument());
    });


    test("shows course details and closes on close button click", async () => {
        render(<Router><Courses /></Router>);
        const searchInput = screen.getByPlaceholderText("Search a course by code...");
        fireEvent.change(searchInput, { target: { value: "CS" } });

        // Fuzzy search should work
        const searchButton = screen.getByRole("button");
        fireEvent.click(searchButton);
        await waitFor(() => expect(getCourseResults).toHaveBeenCalledWith("CS"));

        // Validate card is showing
        const courseName = screen.getByText("Data Structures");
        fireEvent.click(courseName); 
        expect(screen.getByText("Data Structures")).toBeInTheDocument();

        // Try closing the card view
        const closeButton = screen.getByLabelText("close");
        fireEvent.click(closeButton);
        await waitFor(() => expect(screen.queryByText("I'm Interested!")).toBeNull());
    });

    test("shows an error message when the API call fails", async () => {
        render(<Router><Courses /></Router>);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        getCourseResults.mockRejectedValue(new Error("Mock error"));

        const searchInput = screen.getByPlaceholderText("Search a course by code...");
        fireEvent.change(searchInput, { target: { value: "CS" } });
        
        // Check the error handler was hit
        const searchButton = screen.getByRole("button");
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
        consoleErrorSpy.mockRestore();
    });
});