import { useState } from "react";
import Navbar from "./Navbar";

const courses = [
    {
        id: 1,
        name: "Data Structures",
        code: "CS121",
        likes: 10,
        description: "Learn about data organization, algorithms, and efficiency.",
    },
    {
        id: 2,
        name: "Basic Math",
        code: "MATH101",
        likes: 5,
        dislikes: 1,
        description: "A fundamental course covering arithmetic and basic algebra.",
    },
    {
        id: 3,
        name: "Modern History",
        code: "HIST202",
        likes: 7,
        dislikes: 3,
        description: "An overview of the modern world's history, significant events, and trends.",
    },
];

function Course({ course, setCourse }) {
    return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            <button
                className="text-gray-400 hover:text-gray-200 text-xl self-end"
                onClick={() => setCourse(null)}
            >
                ×
            </button>
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-sm text-gray-400 mb-2">{course.code}</p>
            <p className="flex-grow">{course.description}</p>
            <div className="mt-6 flex justify-between text-lg">
                <span>👍 {course.likes}</span>
                <span>👎 {course.dislikes}</span>
            </div>
        </div>
    );
}

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
                        className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
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
