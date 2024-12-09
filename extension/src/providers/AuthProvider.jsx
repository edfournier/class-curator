import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../providers/AlertProvider";
import axios from "axios";

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
            const cached = await chrome.storage.local.get(["user", "expiry"]);
            let user = cached.user;
            if (!user || cached.expiry < Date.now()) {
                // Fetch user details
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                user = res.data;

                // Cache valid for 1 day
                await chrome.storage.local.set({ user, expiry: Date.now() + 86400000 }); 
            }
            console.log(user);
            setUser(user);

            // Check if we're redirecting to course page from SPIRE
            const { redirect } = await chrome.storage.session.get("redirect");
            if (redirect) {
                await chrome.storage.session.remove("redirect");
                navigate("/courses", { state: { course: redirect } });
            }
            else {
                navigate("/home");
            }
        }
        catch (err) {
            console.error(err);
            alerts.error("Couldn't contact Google servers");
        }
    }

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;