import authAxios from "./auth-axios";

export async function getRecommendations() {
    const res = await authAxios.get("/private/course/recommendations");
    console.log(res);
    return res.data;
}