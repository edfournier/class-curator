import authAxios from "./auth-axios";

export async function getFriends() {
    const res = await authAxios.get(`/private/friend`);
    return res.data;
}

export async function getIncomingRequests() {
    const res = await authAxios.get(`/private/friend/request`);
    return res.data;
}

export async function deleteFriend(id) {
    const res = await authAxios.delete(`private/friend/${id}`)
    return res;
}

export async function postFriendRequest(email) {
    const res = await authAxios.post(`/private/friend/request/`, {
        targetUsername: email
    });
    return res;
}

export async function postRequestDecision(id, isAccepted) {
    if (isAccepted) {
        const res = await authAxios.post(`/private/friend/request/${id}/accept`);
        return res;
    }
    else {
        const res = await authAxios.delete(`/private/friend/request/${id}`);
        return res;
    }
}