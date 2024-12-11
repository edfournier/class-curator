import { ImSpinner10 } from "react-icons/im";

/**
 * Renders a simple loading icon that spins
 */
function Spinner() {
    return (
        <div className="flex h-screen items-center justify-center">
            <ImSpinner10
                aria-label="loading-spinner"
                className="animate-spin text-indigo-500"
                style={{ fontSize: "48px" }}
            />
        </div>
    );
}

export default Spinner;
