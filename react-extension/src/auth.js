const tokenButton = document.getElementById("token-button");
const userButton = document.getElementById("user-button");
const dataContainer = document.getElementById("data-container")

// TODO: cache token, check if token is valid when starting, need seperate login view?
// on the server, use `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}` to get token info

let token = "";

tokenButton.addEventListener("click", () => chrome.identity.getAuthToken({interactive: true}, newToken => token = newToken));
userButton.addEventListener("click", async () => {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { "Authorization": `Bearer ${token}`}
    });
    const user = await res.json();
    dataContainer.innerHTML = `
        <img src="${user.picture}" alt="User Picture" width="96" height="96">
        <h2>${user.name}</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Verified:</strong> ${user.email_verified}</p>
        <p><strong>Domain:</strong> ${user.hd}</p>
    `;
});