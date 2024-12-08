import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";

jest.mock("../providers/AuthProvider", () => {
    return { useAuth: jest.fn() };
});

describe("Navbar Component", () => {
    useAuth.mockReturnValue({
        user: {
            picture: "https://via.placeholder.com/150",
        },
    });

    test("renders all navigation links", () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Friends")).toBeInTheDocument();
        expect(screen.getByText("Courses")).toBeInTheDocument();
    });

    test("renders user profile picture", () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const profileImg = screen.getByAltText("Profile");
        expect(profileImg).toBeInTheDocument();
        expect(profileImg).toHaveAttribute("src", "https://via.placeholder.com/150");
    });

    test("applies correct classes to active link", () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const homeLink = screen.getByText("Home");
        expect(homeLink).toHaveClass("text-lg transition-colors pb-2 hover:text-indigo-500");
    });

    test("applies correct classes to inactive link", () => {
        render(
            <MemoryRouter initialEntries={["/friends"]}>
                <Navbar />
            </MemoryRouter>
        );
        const homeLink = screen.getByText("Home");
        expect(homeLink).toHaveClass("hover:text-indigo-500");
    });
});