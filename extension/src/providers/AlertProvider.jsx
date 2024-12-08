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
            <div aria-label="alert" className={`fixed bottom-0 z-50 w-full duration-500 ease-in-out ${showing ? "translate-y-0" : "translate-y-16"}`}>
                <div className={`p-3 rounded-t-lg font-bold bg-gray-900 border-t-[1px] border-gray-700 flex items-center justify-between`}>
                    <div className="flex items-center">
                        {alert && alert.type === "error" 
                            ? <BiError className="text-red-500 mr-3 text-2xl" /> 
                            : <BiInfoCircle className="text-blue-500 mr-3 text-2xl" /> 
                        }
                        {alert && alert.message}
                    </div>
                    <FaTimes 
                        aria-label="close"
                        className="cursor-pointer hover:text-indigo-600 mr-2" 
                        onClick={hideAlert} 
                    />
                </div>
            </div>
        </AlertContext.Provider>
    );
}

export default AlertProvider;