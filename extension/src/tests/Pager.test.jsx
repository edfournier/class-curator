import { render, screen, fireEvent } from "@testing-library/react";
import Pager from "../components/Pager"; 

const mockOnLeft = jest.fn();
const mockOnRight = jest.fn();

describe("Pager Component", () => {
    test("calls onLeft when the left button is clicked", () => {
        render(
            <Pager
                onLeft={mockOnLeft}
                onRight={mockOnRight}
                leftOff={false}
                rightOff={false}
            />
        );

        const leftButton = screen.getByLabelText("Back");
        fireEvent.click(leftButton);
        expect(mockOnLeft).toHaveBeenCalledTimes(1);
    });

    test("calls onRight when the right button is clicked", () => {
        render(
            <Pager
                onLeft={mockOnLeft}
                onRight={mockOnRight}
                leftOff={false}
                rightOff={false}
            />
        );

        const rightButton = screen.getByLabelText("Next");
        fireEvent.click(rightButton);
        expect(mockOnRight).toHaveBeenCalledTimes(1);
    });

    test("disables the left button when leftOff is true", () => {
        render(
            <Pager
                onLeft={mockOnLeft}
                onRight={mockOnRight}
                leftOff={true}
                rightOff={false}
            />
        );

        const leftButton = screen.getByLabelText("Back");
        expect(leftButton).toBeDisabled();
    });

    test("disables the right button when rightOff is true", () => {
        render(
            <Pager
                onLeft={mockOnLeft}
                onRight={mockOnRight}
                leftOff={false}
                rightOff={true}
            />
        );

        const rightButton = screen.getByLabelText("Next");
        expect(rightButton).toBeDisabled();
    });

    test("does not disable the buttons when both leftOff and rightOff are false", () => {
        render(
            <Pager
                onLeft={mockOnLeft}
                onRight={mockOnRight}
                leftOff={false}
                rightOff={false}
            />
        );

        const leftButton = screen.getByLabelText("Back");
        const rightButton = screen.getByLabelText("Next");
        expect(leftButton).not.toBeDisabled();
        expect(rightButton).not.toBeDisabled();
    });
});