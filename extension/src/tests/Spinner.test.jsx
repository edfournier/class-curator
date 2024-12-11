import { render, screen } from "@testing-library/react";
import Spinner from "../components/Spinner";

describe("Spinner Component", () => {
    test("renders Spinner correctly", () => {
        render(<Spinner />);

        const spinner = screen.getByLabelText("loading-spinner");
        expect(spinner).toBeInTheDocument();
    });
});
