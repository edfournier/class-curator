export async function authCodeFlow() {
    const clientId = chrome.runtime.getManifest().oauth2.client_id;
    const redirectURI = chrome.identity.getRedirectURL();

    const authParams = new URLSearchParams({
        response_type: "code",  
        client_id: clientId,
        redirect_uri: redirectURI,
        scope: chrome.runtime.getManifest().oauth2.scopes.join(" "),  
        access_type: "offline",
        prompt: "consent"
    });

    const redirectURL = await chrome.identity.launchWebAuthFlow({
        url: `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`,
        interactive: true
    });

    const url = new URL(redirectURL);
    const code = new URLSearchParams(url.search).get("code");
    console.log(code);
}
