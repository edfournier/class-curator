import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "../components/FormField"; 

const mockOnChange = jest.fn();

describe("FormField Component", () => {
    test("renders the label correctly", () => {
        render(<FormField label="username" value="" onChange={mockOnChange} />);
        
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    test("renders the input with the correct value", () => {
        render(<FormField label="username" value="user" onChange={mockOnChange} />);

        const input = screen.getByLabelText("Username");
        expect(input).toHaveValue("user");
    });

    test("calls onChange handler when input is modified", () => {
        render(<FormField label="username" value="" onChange={mockOnChange} />);

        const input = screen.getByLabelText("Username");
        fireEvent.change(input, { target: { value: "a" } });
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test("applies correct placeholder when provided", () => {
        render(<FormField label="username" value="" placeholder="Enter your username" onChange={mockOnChange} />);

        const input = screen.getByLabelText("Username");
        expect(input).toHaveAttribute("placeholder", "Enter your username");
    });

    test("renders as a text input by default", () => {
        render(<FormField label="username" value="" onChange={mockOnChange} />);

        const input = screen.getByLabelText("Username");
        expect(input).toHaveAttribute("type", "text");
    });

    test("renders as a number input when", () => {
        render(<FormField label="year" type="number" value={1} onChange={mockOnChange} />);

        const input = screen.getByLabelText("Year");
        expect(input).toHaveAttribute("type", "number");
    });
});