import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

function Pager({ onLeft, onRight, leftLimit, rightLimit }) {
    return (
        <div className="flex justify-center mt-4">
            <button disabled={leftLimit} onClick={onLeft} className="mr-1 disabled:opacity-50">
                <IoArrowBackSharp />
            </button>
            <button disabled={rightLimit} onClick={onRight} className="ml-1 disabled:opacity-50">
                <IoArrowForwardSharp />
            </button>
        </div>
    );
}

export default Pager;