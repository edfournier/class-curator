import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthProvider, { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import { useAlerts } from "../providers/AlertProvider";

global.chrome = {
    identity: {
        getAuthToken: jest.fn(),
    },
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn(),
            clear: jest.fn(),
        },
        session: {
            get: jest.fn(),
            remove: jest.fn(),
        },
    },
};

jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn(),
}));

const mockAlerts = { 
    error: jest.fn(), 
    info: jest.fn() 
};

useAlerts.mockReturnValue(mockAlerts);

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockUseNavigate,
}));

jest.mock("axios");

function TestComponent() {
    const { login } = useAuth();

    return (
        <div>
            <button onClick={() => login({})}>Login</button>
        </div>
    );
}

describe("AuthProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
    });

    test("logs in successfully and navigates correctly with redirect", async () => {
        axios.get.mockResolvedValue({ data: { name: "John Doe", email: "john@example.com" } });
        chrome.identity.getAuthToken.mockResolvedValue({ token: "mockToken" });
        chrome.storage.local.get.mockResolvedValue({ user: null, expiry: 0 });
        chrome.storage.session.get.mockResolvedValue({ redirect: "/courses/123" });

        const button = screen.getByText("Login");
        fireEvent.click(button);

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: "Bearer mockToken" },
        }));
        await waitFor(() => expect(mockUseNavigate).toHaveBeenCalledWith("/courses", { state: { course: "/courses/123" } }));
    });

    test("logs in successfully and navigates correctly without redirect", async () => {
        axios.get.mockResolvedValue({ data: { name: "John Doe", email: "john@example.com" } });
        chrome.identity.getAuthToken.mockResolvedValue({ token: "mockToken" });
        chrome.storage.local.get.mockResolvedValue({ user: true, expiry: Date.now() + 1 });
        chrome.storage.session.get.mockResolvedValue({});

        const button = screen.getByText("Login");
        fireEvent.click(button);
        await waitFor(() => expect(mockUseNavigate).toHaveBeenCalledWith("/home"));
    });

    test("handles user info retrieval failure and shows error alert", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        chrome.identity.getAuthToken.mockResolvedValue({ token: "mockToken" });
        chrome.storage.local.get.mockResolvedValue({ user: null, expiry: 0 });
    
        axios.get.mockRejectedValue(new Error("Mock API error"));

        const button = screen.getByText("Login");
        fireEvent.click(button);
    
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalledWith("Couldn't contact Google servers"));
        expect(chrome.identity.getAuthToken).toHaveBeenCalled();
        expect(mockUseNavigate).not.toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});