import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

/*
 * Simple hook for other components to access the auth context
 */
export function useAuth() {
    return useContext(AuthContext);
}

/*
 * Supposed to be used for auth code flow, but launchWebAuthFlow proved too buggy
 */
export async function getAuthCode() {
    const params = new URLSearchParams({
        response_type: "code",  
        client_id: chrome.runtime.getManifest().oauth2.client_id,
        redirect_uri: chrome.identity.getRedirectURL(),
        scope: chrome.runtime.getManifest().oauth2.scopes.join(" "),  
        prompt: "consent",
        access_type: "offline" // Needed to get refresh token
    });

    // Prompts the user with OAuth consent screen
    const redirectURL = await chrome.identity.launchWebAuthFlow({
        url: `https://accounts.google.com/o/oauth2/auth?${params.toString()}`,
        interactive: true
    });

    // Parse code from redirect URL
    const url = new URL(redirectURL)
    return new URLSearchParams(url.search).get("code");
}