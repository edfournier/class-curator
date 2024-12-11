import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "../components/FormField";

const mockOnChange = jest.fn();

describe("FormField Component", () => {
    test("calls onChange handler when input is modified", () => {
        render(<FormField label="username" value="" onChange={mockOnChange} />);

        // Check handler was fired
        const input = screen.getByLabelText("Username");
        fireEvent.change(input, { target: { value: "a" } });
        expect(mockOnChange).toHaveBeenCalledTimes(1);
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
