chrome.runtime.onMessage.addListener(async (message) => {
    // Case that we're redirecting from SPIRE
    if (message.type === "open-popup") {
        /*
         * Using session storage here because Chrome doesn't offer a way
         * to wait until recieving end is open before sending a message
         */
        await chrome.storage.session.set({ redirect: message.course });
        chrome.action.openPopup();
    }
});
