import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(null);  
    const navigate = useNavigate();

    async function login(details) {
        try {
            // Get token from Chrome's built-in cache
            const token = await chrome.identity.getAuthToken(details); 
            console.log(token);
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

    return (
        <AuthContext.Provider value={{ token, setToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;