import { useState, useRef, createContext, useContext } from "react";
import { BiError, BiInfoCircle } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";

const AlertContext = createContext();

/*
 * Hook for other components to issue alerts
 */
export function useAlerts() {
    return useContext(AlertContext);
}

/**
 * Renders alert (error or info) and exposes an interface for other components to display them
 */
function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);
    const [showing, setShowing] = useState(false);
    const timeoutRef = useRef(null);
    const duration = 3000; // Alerts last 3 seconds

    function showAlert(message, type) {
        const id = Date.now();
        clearTimeout(timeoutRef.current); // Cancel any existing timeout
        setAlert({ id, message, type });
        setShowing(true);
        timeoutRef.current = setTimeout(hideAlert, duration); // Hide the alert after the duration
    }

    function hideAlert() {
        setShowing(false);
    }

    function error(message) {
        showAlert(message, "error");
    }

    function info(message) {
        showAlert(message, "info");
    }

    return (
        <AlertContext.Provider value={{ error, info }}>
            {children}
            <div
                aria-label="alert"
                className={`fixed bottom-0 z-50 w-full duration-500 ease-in-out ${showing ? "translate-y-0" : "translate-y-16"}`}
            >
                <div
                    className={`flex items-center justify-between rounded-t-lg border-t-[1px] border-gray-700 bg-gray-900 p-3 font-bold`}
                >
                    <div className="flex items-center">
                        {alert && alert.type === "error" ? (
                            <BiError className="mr-3 text-2xl text-red-500" />
                        ) : (
                            <BiInfoCircle className="mr-3 text-2xl text-blue-500" />
                        )}
                        {alert && alert.message}
                    </div>
                    <FaTimes
                        aria-label="close"
                        className="mr-2 cursor-pointer hover:text-indigo-600"
                        onClick={hideAlert}
                    />
                </div>
            </div>
        </AlertContext.Provider>
    );
}

export default AlertProvider;
