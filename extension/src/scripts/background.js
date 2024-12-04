chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "open-popup") {
        // Open popup and show the selected course
        chrome.action.openPopup(); 
        chrome.runtime.sendMessage({ type: "show-course", course: message.course });
    }
});