import { useState } from "react";
import { FaTimes, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa"; 

function CourseCard({ course, onClose }) {
    const [thumb, setThumb] = useState("");

    function handleThumb(type) {
        setThumb(type === thumb ? "" : type)
        // TODO: API call for like/dislike status
    }

    return (
        <div className="card">
            <div className="flex justify-between">
                <p className="text-xs text-gray-400">{course.code}</p>
                <FaTimes onClick={onClose} className="cursor-pointer hover:text-indigo-600" />
            </div>
            <h2 className="mb-3 mt-2">{course.name}</h2>
            <div className="mb-2 flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                    <button className="p-1" onClick={() => handleThumb("up")}>
                        {thumb === "up" ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    </button>
                    <span>{course.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-1" onClick={() => handleThumb("down")}>
                        {thumb === "down" ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    </button>
                    <span>{course.dislikes}</span>
                </div>
            </div>
            <p className="flex-grow">{course.description}</p>
        </div>
    );
}

export default CourseCard;