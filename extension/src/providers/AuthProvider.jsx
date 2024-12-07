import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../providers/AlertProvider";

const AuthContext = createContext();

/*
 * Hook for other components to access the auth context
 */
export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const alerts = useAlerts();

    async function login(details) {
        // Retrieve token from Chrome's cache
        const { token }  = await chrome.identity.getAuthToken(details); 

        try {
            // Check cache first for user details
            let { user, expiry } = await chrome.storage.local.get();
            if (!user || expiry < Date.now()) {
                // Fetch user details
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { 
                        "Authorization": `Bearer ${token}`
                    }
                });
                user = await res.json();
                await chrome.storage.local.set({ 
                    user, 
                    expiry: Date.now() + 86400000 // Cache valid for 1 day
                }); 
            }
            console.log(user, expiry);
            setUser(user);
            navigate("/home");
        }
        catch (err) {
            console.error(err);
            alerts.error("Couldn't contact Google servers");
        }
    }

    async function logout() {
        // Nuke state and boot to login
        setUser(null);
        chrome.storage.local.clear();
        navigate("/");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;