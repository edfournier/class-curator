import useAuth from "../auth/useAuth.js";

/**
 * Login screen that redirects once the user's credentials are loaded
 */
function Login() {
    const { login } = useAuth();
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <button onClick={() => login({ interactive: true })} className="px-6">
                Login
            </button>
        </div>
    );
}

export default Login;