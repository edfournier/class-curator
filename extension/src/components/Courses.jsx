import { useState } from "react";
import Navbar from "./Navbar";

const courses = [
    { id: 1, name: "Data Structures", code: "CS121", likes: 10, dislikes: 2, interestedUsers: [] },
    { id: 2, name: "Basic Math", code: "MATH101", likes: 5, dislikes: 1, interestedUsers: [] },
    { id: 3, name: "Modern History", code: "HIST202", likes: 7, dislikes: 3, interestedUsers: [] },
];

function Courses() {
    const [query, setQuery] = useState("");
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
            className="flex justify-between items-center border-b border-gray-600 py-3 cursor-pointer"
            onClick={() => setCourse(course)}
        >
            <span className="text-sm text-white">{course.name}</span>
            <span className="text-sm text-gray-400">{course.code}</span>
        </li>
    ));

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-2 py-3">
            <div className="flex justify-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 placeholder-gray-600"
                    placeholder="Search a course by name or code..."
                />
                </div>
                {filtered.length > 0 && query != "" && <ul className="mt-2">{results}</ul>}
            </div>
        </>
    );
}

export default Courses;