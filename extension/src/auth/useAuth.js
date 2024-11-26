import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

/*
 * Simple hook for other components to acccess the auth context
 */
function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;