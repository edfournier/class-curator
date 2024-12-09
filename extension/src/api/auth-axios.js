import axios from "axios";

const authAxios = axios.create();

/**
 * Attach token automatically to auth-related requests
 */
authAxios.interceptors.request.use(
    async (config) => {
        const { token }  = await chrome.identity.getAuthToken(details); 
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    }
);

export default authAxios;