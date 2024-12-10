import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { useAuth } from "../providers/AuthProvider";

jest.mock("../providers/AuthProvider", () => {
	return { useAuth: jest.fn() };
});

jest.mock("../components/Spinner", () => () => <div>Loading...</div>);

const mockLogin = jest.fn();

useAuth.mockReturnValue({
	login: mockLogin
});

describe("Login Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("calls handleLogin on component mount for auto-login", async () => {
        render(<Login />);

        // Should do auto-login
		await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ interactive: false }));
	});

	test("calls handleLogin when login button is clicked", async () => {
        render(<Login />);

        // Should attempt consent flow when clciekd
		await waitFor(() => expect(screen.getByText("Login with Google")).toBeInTheDocument());
        await waitFor(() => fireEvent.click(screen.getByText("Login with Google")))
		expect(mockLogin).toHaveBeenCalledWith({ interactive: true });
	});

    test("logs error when auto-login fails", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        mockLogin.mockRejectedValueOnce(new Error("Auto-login failed"));
        render(<Login />);

        // Expect error handler to be called when user didn't accept or hasn't accepted OAuth
        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ interactive: false }));
        expect(consoleSpy).toHaveBeenCalledWith(new Error("Auto-login failed"));
        consoleSpy.mockRestore(); 
    });
});