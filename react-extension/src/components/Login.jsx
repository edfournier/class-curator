import { Navigate } from "react-router";
import useAuth from "../auth/useAuth.js";

function Login() {
    const auth = useAuth();
    return auth.token ? <Navigate to={"/home"}/> : (
        <>
            <button onClick={() => auth.login({ interactive: true })}>Login</button>
        </>
    );
}

export default Login;