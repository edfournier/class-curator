import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));  
    const [token, setToken] = useState((localStorage.getItem("token"))); 
    const navigate = useNavigate();

    async function login() {
        try {
            // Fetch OAuth token and corresponding user
            const { grantedScopes, token } = await chrome.identity.getAuthToken({interactive: true});
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { "Authorization": `Bearer ${token}`}
            });
            const user = await res.json(); 

            // Cache state and redirect
            setUser(user);
            setToken(token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            return navigate("/home");
        }
        catch (error) {
            console.error("Login failed:", error);
        }
    }

    function logout() {
        // Nuke caches and redirect to login
        setUser(null);
        setToken(null);
        locaLStorage.clear();
        return navigate("/");
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;