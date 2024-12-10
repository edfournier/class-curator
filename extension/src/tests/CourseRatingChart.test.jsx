import { render, screen } from "@testing-library/react";
import CourseRatingChart from "../components/CourseRatingChart";

const mockData = [
    { session: { semester: "SPRING", year: 2022 }, helpfulness: 4.5, difficulty: 3.2 },
    { session: { semester: "FALL", year: 2021 }, helpfulness: 4.8, difficulty: 3.0 },
    { session: { semester: "SPRING", year: 2021 }, helpfulness: 4.1, difficulty: 2.8 },
    { session: { semester: "FALL", year: 2022 }, helpfulness: 4.8, difficulty: 3.0 },
];

describe("CourseRatingChart", () => {

    test("renders the LineChart with correct data", () => {
        render(<CourseRatingChart data={mockData} />);

        // Check if the chart has the correct keys
        const xAxisKeys = screen.getAllByText(/S-\d{2}|F-\d{2}/);
        expect(xAxisKeys.length).toBe(4);
        expect(xAxisKeys.map((e) => e.textContent)).toEqual(["S-21", "F-21", "S-22", "F-22"]);
        expect(screen.getByText("Quality")).toBeInTheDocument();
        expect(screen.getByText("Difficulty")).toBeInTheDocument();
    });

    test("handles empty data gracefully", () => {
        render(<CourseRatingChart data={[]} />);

        // Check the graph is empty
        const xAxisKeys = screen.queryAllByText(/S-\d{2}|F-\d{2}/);
        expect(xAxisKeys.length).toBe(0);
        expect(screen.getByText("Quality")).toBeInTheDocument();
        expect(screen.getByText("Difficulty")).toBeInTheDocument();
    });
});
