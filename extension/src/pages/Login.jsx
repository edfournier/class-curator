import { useAuth } from "../providers/AuthProvider";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";

/**
 * Login screen that redirects once the user's credentials are loaded
 */
function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(true);

    async function handleLogin(details) {
        try {
            setLoading(true);
            await login(details);
        }
        catch (err) {
            // Triggers if auto-login fails (i.e. new user) or user doesn't approve access
            console.log(err); 
        }
        finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        // Attempts to automatically login
        handleLogin({ interactive: false })
    }, []);
    
    return loading ? <Spinner /> : (
        <div className="flex items-center justify-center min-h-screen">
            <button onClick={() => handleLogin({ interactive: true })} className="px-6">
                Login
            </button>
        </div>
    );
}

export default Login;