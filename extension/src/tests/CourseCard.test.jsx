import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CourseCard from "../components/CourseCard";
import { getCourseDetails, getCourseInsights, putCourseInterest, deleteCourseInterest, postCourseRating } from "../api/courses";
import { useAlerts } from "../providers/AlertProvider";

jest.mock("../api/courses", () => ({
    getCourseDetails: jest.fn(),
    getCourseInsights: jest.fn(),
    putCourseInterest: jest.fn(),
    deleteCourseInterest: jest.fn(),
    postCourseRating: jest.fn(),
}));

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn(),
}));

const mockAlerts = {
    error: jest.fn(),
    info: jest.fn(),
};

useAlerts.mockReturnValue(mockAlerts);

const mockCourse = {
    code: "CS101",
    name: "Introduction to Programming",
};

getCourseInsights.mockResolvedValue({
    ratingHistory: [
        { session: { semester: "SPRING", year: 2023 }, helpfulness: 4.5, difficulty: 3.0 },
        { session: { semester: "FALL", year: 2022 }, helpfulness: 4.2, difficulty: 2.8 },
    ],
    profRatings: {
        "Dr. Alice": 4.8,
    }
});

getCourseDetails.mockResolvedValue({
    userRating: 0,
    upvotes: 10,
    downvotes: 2,
    course: {
        description: "An introductory course on programming concepts and techniques.",
    },
});

describe("CourseCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders course details and insights", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);

        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        expect(screen.getByText("Introduction to Programming")).toBeInTheDocument();
        expect(screen.getByText("An introductory course on programming concepts and techniques.")).toBeInTheDocument();
        expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
        expect(screen.getByText("4.8")).toBeInTheDocument();
    });

    test("handles upvote and downvote button clicks", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        const upvoteButton = screen.getByLabelText("like");
        const downvoteButton = screen.getByLabelText("dislike");

        // Click the upvote button
        fireEvent.click(upvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledWith(mockCourse.code, 1));

        // Click the downvote button
        fireEvent.click(downvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledWith(mockCourse.code, -1));
    });

    test("handles interest button click", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        // Get the interest button
        const interestButton = screen.getByLabelText("interest");

        // Click the "I'm Interested!" button (first time)
        fireEvent.click(interestButton);
        await waitFor(() => expect(putCourseInterest).toHaveBeenCalledWith(mockCourse.code));

        // Click the "I'm Interested!" button (first time)
        fireEvent.click(interestButton);
        await waitFor(() => expect(deleteCourseInterest).toHaveBeenCalledWith(mockCourse.code));
    });

    test("handles many vote clicks", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        const upvoteButton = screen.getByLabelText("like");
        const downvoteButton = screen.getByLabelText("dislike");

        fireEvent.click(downvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledTimes(1));

        fireEvent.click(upvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledTimes(2));

        fireEvent.click(upvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledTimes(3));
    });

    test("handles error when fetching course details or insights", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        getCourseDetails.mockRejectedValueOnce(new Error("Failed to fetch course details"));
        getCourseInsights.mockRejectedValueOnce(new Error("Failed to fetch course insights"));

        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);

        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        // Check that alerts.error was called
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Failed to get course details and insights"));
        consoleErrorSpy.mockRestore();
    });

    test("handles error when voting on the course", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);

        // Mock the postCourseRating to throw an error
        postCourseRating.mockRejectedValueOnce(new Error("Failed to register rating"));

        const upvoteButton = screen.getByLabelText("like");

        fireEvent.click(upvoteButton);

        // Wait for the error handler to be called
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Failed to register rating, please try again"));

        consoleErrorSpy.mockRestore();
    });  
    
    test("handles error when adding interest", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);

        // Mock the putCourseInterest to throw an error
        putCourseInterest.mockRejectedValueOnce(new Error("Failed to register interest"));

        const interestButton = screen.getByLabelText("interest");

        // Click the "I'm Interested!" button
        fireEvent.click(interestButton);

        // Check that error handler was called
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Failed to register interest, please try again"));

        consoleErrorSpy.mockRestore();
    });
    
});