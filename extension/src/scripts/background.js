chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "open-popup") {
        // Open popup and show the selected course
        await chrome.action.openPopup(); 
        chrome.runtime.sendMessage({ type: "show-course", course: message.course });
    }
});