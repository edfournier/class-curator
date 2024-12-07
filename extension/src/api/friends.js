export async function getFriends() {
    return Promise.resolve([
        { name: "Alice", email: "alice@umass.edu" },
        { name: "Bob", email: "bob@umass.edu" },
        { name: "Charlie", email: "charlie@umass.edu" },
        { name: "David", email: "david@umass.edu" },
        { name: "Eva", email: "eva@umass.edu" }
    ]);
}

export async function getRequests() {
    return Promise.resolve([
        { name: "Johnny", email: "jappleseed@umass.edu" },
        { name: "Sally", email: "sally@umass.edu" }
    ]);
}

export async function deleteFriend() {

}

export async function postFriendRequest() {

}

export async function postRequestDecision() {

}