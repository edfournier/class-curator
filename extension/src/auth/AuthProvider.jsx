import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthCode } from "./auth.js";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(null);  
    const navigate = useNavigate();

    async function login() {
        try {
            // TODO: attempt to login automatically by looking for token in cache
            const code = await getAuthCode();
            console.log(code);

            // For some reason on MacOS, if you don't alert, the popup closes
            if (/Macintosh|Mac OS X/i.test(navigator.userAgent)) {
                alert("Welcome!");
            }

            const token = ""; // TODO: exchange auth code for token
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