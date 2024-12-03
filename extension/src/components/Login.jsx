import { useAuth } from "../auth/auth.js";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";

/**
 * Login screen that redirects once the user's credentials are loaded
 */
function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Attempts to automatically login
        login().then(() => setLoading(false));
    }, []);
    
    return loading ? <Spinner /> : (
        <div className="flex items-center justify-center min-h-screen">
            <button onClick={() => login({ interactive: true })} className="px-6">
                Login
            </button>
        </div>
    );
}

export default Login;