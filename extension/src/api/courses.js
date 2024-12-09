import axios from "axios";
import authAxios from "./auth-axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getCourseResults(query) {
    const res = await axios.get(`/course?course_code_query=${query}`);
    return res.data;
}

export async function getCourseDetails(code) {
    const res = await authAxios.get(`/private/course/${code}`);
    return res.data;
}

export async function getCourseInsights(code) {
    return Promise.resolve({
        prof: "Cameron Musco", // Recommended professor

        // Historical data
        data: [
            { semester: "FALL", year: 2019, helpfulness: 1.2, difficulty: 2.2 },
            { semester: "FALL", year: 2017, helpfulness: 4.8, difficulty: 4.6 },
            { semester: "SPRING", year: 2023, helpfulness: 1.1, difficulty: 3.4 },
            { semester: "SPRING", year: 2018, helpfulness: 3.5, difficulty: 2.9 },
            { semester: "SPRING", year: 2016, helpfulness: 2.2, difficulty: 4.8 },
            { semester: "SPRING", year: 2021, helpfulness: 2.6, difficulty: 0.2 },
            { semester: "FALL", year: 2016, helpfulness: 2.8, difficulty: 2.6 },
            { semester: "FALL", year: 2022, helpfulness: 4.6, difficulty: 2.1 },
        ]
    });
}

export async function postCourseRating(code, vote) {
    const res = await authAxios.post(`/private/course/${code}/rating?v=${vote}`);
    return res;
}

export async function postCourseInterest(code, isInterested) {
    return Promise.resolve();
}