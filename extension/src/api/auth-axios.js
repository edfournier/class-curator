import axios from "axios";

const authAxios = axios.create();

authAxios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

/**
 * Attach token automatically to auth-related requests
 */
authAxios.interceptors.request.use(
    async (config) => {
        const { token }  = await chrome.identity.getAuthToken({ interactive: false }); 
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    }
);

export default authAxios;