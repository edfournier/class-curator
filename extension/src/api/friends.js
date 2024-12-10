import authAxios from "./auth-axios";

export async function getFriends() {
    const res = await authAxios.get(`/private/friend`);
    console.log(res.data);
    return res.data;
}

export async function getIncomingRequests() {
    const res = await authAxios.get(`/private/friend/request`);
    console.log(res.data);
    return res.data;
}

export async function deleteFriend(id) {
    const res = await authAxios.delete(`private/friend/${id}`)
    return res;
}

export async function postFriendRequest(email) {
    const res = await authAxios.post(`/private/friend/request/${email}`);
    return res;
}

export async function postRequestDecision(id, isAccepted) {
    const res = await authAxios.post(`private/friend/request/${id}/${isAccepted ? "accept" : "deny"}`);
    return res;
}