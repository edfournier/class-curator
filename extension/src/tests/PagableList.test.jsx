import { render, screen, fireEvent } from "@testing-library/react";
import PagableList from "../components/PagableList";

const mockOnClick = jest.fn();
const mockEntries = [
    { name: "Item 1", desc: "Desc 1" },
    { name: "Item 2", desc: "Desc 2" },
    { name: "Item 3", desc: "Desc 3" },
    { name: "Item 4", desc: "Desc 4" },
    { name: "Item 5", desc: "Desc 5" },
    { name: "Item 6", desc: "Desc 6" }
];

describe("PagableList Component", () => {
    test("renders empty message when no entries", () => {
        render(
            <PagableList entries={[]} onClick={mockOnClick} mainKey="name" subKey="desc" emptyMessage="No entries" />
        );

        expect(screen.getByText("No entries")).toBeInTheDocument();
    });

    beforeEach(() => {
        render(
            <PagableList
                entries={mockEntries}
                onClick={mockOnClick}
                mainKey="name"
                subKey="desc"
                emptyMessage="No entries"
            />
        );
    });

    test("renders entries correctly", () => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Desc 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Desc 2")).toBeInTheDocument();
    });

    test("correctly updates the page on pagination", () => {
        const leftButton = screen.getByRole("button", { name: /back/i });
        const rightButton = screen.getByRole("button", { name: /next/i });

        // Initially showing items 1 to 4
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.queryByText("Item 6")).toBeNull();

        // Clicking next
        fireEvent.click(rightButton);
        expect(screen.queryByText("Item 1")).toBeNull();
        expect(screen.getByText("Item 6")).toBeInTheDocument();

        // Clicking previous
        fireEvent.click(leftButton);
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.queryByText("Item 6")).toBeNull();
    });

    test("calls onClick when an item is clicked", () => {
        const item = screen.getByText("Item 1");
        fireEvent.click(item);
        expect(mockOnClick).toHaveBeenCalledWith({
            name: "Item 1",
            desc: "Desc 1"
        });
    });
});
