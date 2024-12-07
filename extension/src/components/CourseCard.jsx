import { FaTimes } from "react-icons/fa"; 

function CourseCard({ course, onClose }) {
    return (
        <div className="bg-gray-900 p-3 rounded-md border-gray-700">
            <div className="flex justify-between">
                <h2>{course.name}</h2>
                <FaTimes onClick={onClose} className="cursor-pointer" />
            </div>
            <p className="text-sm text-gray-400 mb-2">{course.code}</p>
            <div className="mb-2">👍 {course.likes} | 👎 {course.dislikes}</div>
            <p className="flex-grow">{course.description}</p>
        </div>
    );
}

export default CourseCard;