import { Navigate } from "react-router";
import useAuth from "../auth/useAuth.js";

function Login() {
    const auth = useAuth();
    return auth.user ? <Navigate to={"/home"}/> : (
        <>
            <button onClick={auth.login}>Login</button>
        </>
    );
}

export default Login;