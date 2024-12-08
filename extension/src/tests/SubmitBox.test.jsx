import { render, screen, fireEvent } from "@testing-library/react";
import SubmitBox from "../components/SubmitBox";
import { FaSearch } from "react-icons/fa"; 

const mockOnChange = jest.fn();
const mockOnClick = jest.fn();
const mockValue = "Search query";

describe("SubmitBox Component", () => {
    beforeEach(() => {
        render(
            <SubmitBox
                value={mockValue}
                onChange={mockOnChange}
                onClick={mockOnClick}
                hint="Enter text"
                icon={<FaSearch />}
            />
        );
    });

    test("renders input and button correctly", () => {
        expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByRole("button")).toContainHTML('<svg');
    });

    test("calls onChange when input value changes", () => {
        const input = screen.getByPlaceholderText("Enter text");
        fireEvent.change(input, { target: { value: "a" } });
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test("calls onClick when button is clicked", () => {
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});