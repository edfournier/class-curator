import { useState } from "react";
import Navbar from "./Navbar";
import { FaTimes } from "react-icons/fa"; 
import { useLocation } from 'react-router-dom';

const courses = [
    {
        id: 1,
        name: "Data Structures",
        code: "CS121",
        likes: 10,
        dislikes: 0,
        description: "Learn about data organization, algorithms, and efficiency.",
    },
    {
        id: 2,
        name: "Basic Math",
        code: "MATH101",
        likes: 5,
        dislikes: 1,
        description: "A fundamental course covering arithmetic and basic algebra.",
    }
];

function Course({ course, setCourse }) {
    return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold">{course.name}</h1>
                <FaTimes onClick={() => setCourse(null)} className="cursor-pointer" />
            </div>
            <p className="text-sm text-gray-400 mb-2">{course.code}</p>
            <div className="mb-2">👍 {course.likes} | 👎 {course.dislikes}</div>
            <p className="flex-grow">{course.description}</p>
        </div>
    );
}

function Courses() {
    const location = useLocation();
    const [query, setQuery] = useState(location?.state?.course || "");
    const [course, setCourse] = useState(null); // The selected course

    // Finds courses that contain the search query
    const filtered = courses.filter((course) => {
        const lowered = query.toLowerCase();
        return course.name.toLowerCase().includes(lowered) 
            || course.code.toLowerCase().includes(lowered);
    });

    // Map each matched course to a search result tile
    const results = filtered.map((course) => (
        <li
            key={course.id}
            className="flex justify-between border border-gray-700 hover:bg-gray-700 rounded-lg py-2 px-2 cursor-pointer"
            onClick={() => setCourse(course)}
        >
            <span className="text-sm text-white">{course.name}</span>
            <span className="text-sm text-gray-400">{course.code}</span>
        </li>
    ));

    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto px-4 py-3">
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-72"
                        placeholder="Search a course by name or code..."
                    />
                </div>
                {course 
                    // Either render the search results or the selected course
                    ? <Course course={course} setCourse={setCourse} />
                    : query !== "" && filtered.length > 0 && <ul className="space-y-1">{results}</ul>
                }
            </div>
        </>
    );
}

export default Courses;
