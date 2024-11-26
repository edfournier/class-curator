import { Navigate } from "react-router";
import useAuth from "../auth/useAuth.js";

function Login() {
    const { token, login } = useAuth();
    
    return token ? <Navigate to="/home" /> : (
        <div className="flex items-center justify-center min-h-screen">
            <button
                onClick={() => login({ interactive: true })}
                className="px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-lg hover:bg-indigo-600 active:scale-95"
            >
                Login
            </button>
        </div>
    );
}

export default Login;