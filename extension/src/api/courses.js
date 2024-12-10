import axios from "axios";
import authAxios from "./auth-axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getCourseResults(query) {
    const res = await axios.get(`/course?course_code_query=${query}`);
    return res.data;
}

export async function getCourseInsights(code) {
    const res = await axios.get(`course/${code}/insights`);
    return res.data;
}

export async function getCourseDetails(code) {
    const res = await authAxios.get(`/private/course/${code}`);
    return res.data;
}

export async function postCourseRating(code, vote) {
    const res = await authAxios.post(`/private/course/${code}/rating?v=${vote}`);
    return res;
}

export async function putCourseInterest(code) {
    const res = await authAxios.put(`private/course/${code}/interest`);
    return res;
}

export async function deleteCourseInterest(code) {
    const res = await authAxios.delete(`private/course/${code}/interest`);
    return res;
}