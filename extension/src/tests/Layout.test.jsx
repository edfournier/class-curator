import { render, screen } from "@testing-library/react";
import Layout from "../components/Layout";

jest.mock("../components/Navbar", () => () => <div>Navbar</div>);

describe("Layout Component", () => {
    beforeEach(() => {
        render(
            <Layout>
                <div>Test Child</div>
            </Layout>
        );
    });

    test("renders Navbar component", () => {
        expect(screen.getByText("Navbar")).toBeInTheDocument();
    });

    test("renders children correctly", () => {
        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
});
