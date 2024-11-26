import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(null);  
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function login(details) {
        try {
            // Get token from Chrome's built-in cache
            const { token } = await chrome.identity.getAuthToken(details);
            setToken(token);
            navigate("/home");
        }
        catch (error) {
            console.error("Login failed:", error);
        }
    }

    async function logout() {
        // Nukes context and boots to login
        setToken(null);
        navigate("/");
    }

    useEffect(() => {
        // Attempts to automatically login
        login({ interactive: false }).then(() => setLoading(false));
    }, []);

    // Load the spinner while attempting to auto-login
    return loading ? <Spinner /> : (
        <AuthContext.Provider value={{ token, setToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;