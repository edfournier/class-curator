import { useNavigate } from "react-router-dom";

/**
 * Attaches listener for Chrome messages directed at the popup
 */
function Listener({ children }) {
    const navigate = useNavigate();

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "show-course") {
            navigate("/courses", { state: { course: message.course } });
        }
    });

    return children;
}

export default Listener;