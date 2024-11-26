import React from "react";
import { ImSpinner10 } from "react-icons/im";

function Spinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <ImSpinner10
                className="text-indigo-500 animate-spin"
                style={{ fontSize: "48px" }}
            />
        </div>
    );
}

export default Spinner;