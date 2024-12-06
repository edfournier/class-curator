import { FaTimes } from "react-icons/fa"; 

function Course({ course, setCourse }) {
    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            <div className="flex justify-between">
                <h2>{course.name}</h2>
                <FaTimes onClick={() => setCourse(null)} className="cursor-pointer" />
            </div>
            <p className="text-sm text-gray-400 mb-2">{course.code}</p>
            <div className="mb-2">👍 {course.likes} | 👎 {course.dislikes}</div>
            <p className="flex-grow">{course.description}</p>
        </div>
    );
}

export default Course;