import { render, screen, fireEvent } from "@testing-library/react";
import AlertProvider, { useAlerts } from "../providers/AlertProvider";

// Helper component to trigger alerts
function TestComponent() {
    const alerts = useAlerts();
    return (
        <div>
            <button onClick={() => alerts.error("This is an error!")}>Show Error</button>
            <button onClick={() => alerts.info("This is an info!")}>Show Info</button>
        </div>
    );
}

describe("AlertProvider Component", () => {
    beforeEach(() => {
        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );
    });

    test("renders error alert correctly", async () => {
        fireEvent.click(screen.getByText("Show Error"));
        expect(screen.getByText("This is an error!")).toBeInTheDocument();
    });

    test("renders info alert correctly", async () => {
        fireEvent.click(screen.getByText("Show Info"));
        expect(screen.getByText("This is an info!")).toBeInTheDocument();
    });

    test("closes the alert when the close button is clicked", async () => {
        const closeButton = screen.getByLabelText("close");
        fireEvent.click(screen.getByText("Show Error"));
        fireEvent.click(closeButton);
        expect(screen.getByLabelText("alert")).toHaveClass("translate-y-16");
    });
});
