chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "popup") {
        // Only background script can access action API
        chrome.action.openPopup();

        // TODO: send course to popup script
        // use either local storage or send another message
        console.log(message.course.title); 
    }
});