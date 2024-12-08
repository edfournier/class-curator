import { ImSpinner10 } from "react-icons/im";

/**
 * Renders a simple loading icon that spins
 */
function Spinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <ImSpinner10
                aria-label="loading-spinner"
                className="text-indigo-500 animate-spin"
                style={{ fontSize: "48px" }}
            />
        </div>
    );
}

export default Spinner;