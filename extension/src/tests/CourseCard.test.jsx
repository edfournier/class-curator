import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CourseCard from "../components/CourseCard";
import { getCourseDetails, getCourseInsights, putCourseInterest, deleteCourseInterest, postCourseRating } from "../api/courses";
import { useAlerts } from "../providers/AlertProvider";


const mockCourse = {
    code: "CS101",
    name: "Intro",
};

const mockAlerts = {
    error: jest.fn(),
    info: jest.fn(),
};

useAlerts.mockReturnValue(mockAlerts);

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

describe("CourseCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getCourseInsights.mockResolvedValue({
            ratingHistory: [
                { session: { semester: "SPRING", year: 2023 }, helpfulness: 4.5, difficulty: 3.0 },
                { session: { semester: "FALL", year: 2022 }, helpfulness: 4.2, difficulty: 2.8 },
            ],
            profRatings: { "Marius": 4.8 }
        });
        
        getCourseDetails.mockResolvedValue({
            userRating: 0, upvotes: 10, downvotes: 2, course: { description: "Desc", }, }
        );
    });

    test("handles upvote and downvote button clicks", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        const upvoteButton = screen.getByLabelText("like");
        const downvoteButton = screen.getByLabelText("dislike");

        // Click buttons and check corresponding methods
        fireEvent.click(upvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledWith(mockCourse.code, 1));
        fireEvent.click(downvoteButton);
        await waitFor(() => expect(postCourseRating).toHaveBeenCalledWith(mockCourse.code, -1));
    });

    test("handles interest button click", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        const interestButton = screen.getByLabelText("interest");

        // Click and reclick interest button
        fireEvent.click(interestButton);
        await waitFor(() => expect(putCourseInterest).toHaveBeenCalledWith(mockCourse.code));
        fireEvent.click(interestButton);
        await waitFor(() => expect(deleteCourseInterest).toHaveBeenCalledWith(mockCourse.code));
    });

    test("handles many vote clicks", async () => {
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));

        const upvoteButton = screen.getByLabelText("like");
        const downvoteButton = screen.getByLabelText("dislike");

        // Hits the branches that change course.details.upvotes/downvotes
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

        // Check error handler was hit
        await waitFor(() => expect(getCourseDetails).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(getCourseInsights).toHaveBeenCalledWith(mockCourse.code));
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
        consoleErrorSpy.mockRestore();
    });

    test("handles error when voting on the course", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        postCourseRating.mockRejectedValueOnce(new Error("Failed to register rating"));
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);

        // Check error handler was hit
        const upvoteButton = screen.getByLabelText("like");
        fireEvent.click(upvoteButton);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
        consoleErrorSpy.mockRestore();
    });  
    
    test("handles error when adding interest", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        putCourseInterest.mockRejectedValueOnce(new Error("Failed to register interest"));
        render(<CourseCard course={mockCourse} onClose={jest.fn()} />);

        // Check error handler was hit
        const interestButton = screen.getByLabelText("interest");
        fireEvent.click(interestButton);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
        consoleErrorSpy.mockRestore();
    });
    
});