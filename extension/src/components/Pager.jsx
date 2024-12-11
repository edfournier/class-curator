import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

/**
 * Renders back and next buttons with dynamic styling for use in PagableList
 */
function Pager({ onLeft, onRight, leftOff, rightOff }) {
    return (
        <div className="mt-4 flex justify-center">
            <button aria-label="Back" disabled={leftOff} onClick={onLeft} className="mr-1 disabled:opacity-50">
                <IoArrowBackSharp />
            </button>
            <button aria-label="Next" disabled={rightOff} onClick={onRight} className="ml-1 disabled:opacity-50">
                <IoArrowForwardSharp />
            </button>
        </div>
    );
}

export default Pager;
