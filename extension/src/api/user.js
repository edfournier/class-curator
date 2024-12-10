import axios from "axios";
import authAxios from "./auth-axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getUserDetails() {
    const res = await authAxios.get(`/private/user`);
    return res.data;
}

export async function putUserDetails(details) {
    const res = await authAxios.put(`private/user`, details);
    return res;
}

export async function getCurrentUserInterests() {
    const res = await authAxios.get(`/private/user/interests`);
    return res;
}

export async function getUserInterests(id) {
    const res = await authAxios.get(`/private/user/interests`);
    return res;
}