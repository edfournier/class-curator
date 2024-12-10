import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthProvider, { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import { useAlerts } from "../providers/AlertProvider";

// Mocks chrome API
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

const mockUseNavigate = jest.fn();

const mockAlerts = { 
    error: jest.fn(), 
    info: jest.fn() 
};

useAlerts.mockReturnValue(mockAlerts);


jest.mock("../providers/AlertProvider", () => ({
    useAlerts: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockUseNavigate,
}));

jest.mock("axios");

// Renders dummy login
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
        axios.get.mockResolvedValue({ data: { name: "Fake", email: "fake@gmail.com" } });
        chrome.identity.getAuthToken.mockResolvedValue({ token: "mockToken" });
        chrome.storage.local.get.mockResolvedValue({ mockToken: { user: null, expiry: 0 } });
        chrome.storage.session.get.mockResolvedValue({ redirect: "some-course" });

        // Should navigate to /course with some-course state
        const button = screen.getByText("Login");
        fireEvent.click(button);
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: "Bearer mockToken" },
        }));
        await waitFor(() => expect(mockUseNavigate).toHaveBeenCalledWith("/courses", { state: { course: "some-course" } }));
    });

    test("logs in successfully and navigates correctly without redirect", async () => {
        axios.get.mockResolvedValue({ data: { name: "Fake", email: "fake@gmail.com" } });
        chrome.identity.getAuthToken.mockResolvedValue({ token: "mockToken" });
        chrome.storage.local.get.mockResolvedValue({ mockToken: { user: true, expiry: 1000000000000000 } });
        chrome.storage.session.get.mockResolvedValue({});

        // Should do default behavior, which is going home
        const button = screen.getByText("Login");
        fireEvent.click(button);
        await waitFor(() => expect(mockUseNavigate).toHaveBeenCalledWith("/home"));
    });

    test("handles user info retrieval failure and shows error alert", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        // E.g if google is down
        axios.get.mockRejectedValue(new Error("Mock error")); 
        chrome.identity.getAuthToken.mockResolvedValue({ token: "mockToken" });
        chrome.storage.local.get.mockResolvedValue({ mockToken: { user: null, expiry: 0 } }); 
        
        const button = screen.getByText("Login");
        fireEvent.click(button);
        await waitFor(() => expect(mockAlerts.error).toHaveBeenCalled());
        expect(chrome.identity.getAuthToken).toHaveBeenCalled();
        expect(mockUseNavigate).not.toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});