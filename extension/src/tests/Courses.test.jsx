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

const mockAlerts = { 
    error: jest.fn(), 
    info: jest.fn() 
};

useAlerts.mockReturnValue(mockAlerts);

getCourseResults.mockResolvedValue([
    { name: "Data Structures", code: "CS121", id: 1 },
    { name: "Basic Math", code: "MATH101", id: 2 },
]);

getCourseDetails.mockResolvedValue({
    id: 1,
    name: "Data Structures",
    code: "CS121",
    likes: 10,
    dislikes: 0,
    description: "Learn about data organization, algorithms, and efficiency."
});

getCourseInsights.mockResolvedValue({
    prof: "Cameron Musco", 
    data: [{ semester: "FALL", year: 2019, helpfulness: 1.2, difficulty: 2.2 }]
});

describe("Courses", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <Router>
                <Courses />
            </Router>
        );
    });

    test("searches and displays course results", async () => {
        const searchInput = screen.getByPlaceholderText("Search a course by code or name...");
        fireEvent.change(searchInput, { target: { value: "CS" } });

        const searchButton = screen.getByRole("button");
        fireEvent.click(searchButton);

        await waitFor(() => expect(getCourseResults).toHaveBeenCalledWith("CS"));
        expect(screen.getByText("Data Structures")).toBeInTheDocument();
        expect(screen.getByText("CS121")).toBeInTheDocument();
        expect(screen.getByText("Basic Math")).toBeInTheDocument();
        expect(screen.getByText("MATH101")).toBeInTheDocument();
    });

    test("shows course details and closes on close button click", async () => {
        const searchInput = screen.getByPlaceholderText("Search a course by code or name...");
        fireEvent.change(searchInput, { target: { value: "CS" } });
        const searchButton = screen.getByRole("button");
        fireEvent.click(searchButton);

        await waitFor(() => expect(getCourseResults).toHaveBeenCalledWith("CS"));
        const courseName = screen.getByText("Data Structures");
        fireEvent.click(courseName); 
        expect(screen.getByText("Data Structures")).toBeInTheDocument();

        const closeButton = screen.getByLabelText("close");
        fireEvent.click(closeButton);
        await waitFor(() => expect(screen.queryByText("I'm Interested!")).toBeNull());
    });

    test("shows an error message when the API call fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        getCourseResults.mockRejectedValue(new Error("API error"));

        const searchInput = screen.getByPlaceholderText("Search a course by code or name...");
        fireEvent.change(searchInput, { target: { value: "CS" } });
        
        const searchButton = screen.getByRole("button");
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Failed to execute query, please try again"));

        consoleErrorSpy.mockRestore();
    });
});