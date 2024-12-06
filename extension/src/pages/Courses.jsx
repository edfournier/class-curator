import { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import { useLocation } from "react-router-dom";
import { fetchCourse, fetchCourseResults } from "../api/courses";
import Course from "../components/Course";

function Courses() {
    const location = useLocation();
    const [query, setQuery] = useState(location?.state?.course || ""); // Handles open-popup trigger
    const [course, setCourse] = useState(null); 
    const [results, setResults] = useState([]); 

    async function search() {
        // Fetch results and map each matched course to a search result tile
        const courses = await fetchCourseResults(query);
        setResults(courses);
    }

    async function showCourse(course) {
        const result = await fetchCourse(course.id);
        setCourse(result);
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-3">
            <h1>Course Search</h1> 
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    spellCheck={true}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-60"
                    placeholder="Search a course by code or name..."
                />
                <button onClick={search} className="ml-1"><FaSearch /></button>
            </div>
            {course 
                // Either render the search results or the selected course's page
                ? <Course course={course} setCourse={setCourse} />
                : <ul className="space-y-1">
                    {results.map((course) => 
                        <li key={course.id} className="flex justify-between" onClick={() => showCourse(course)}>
                            <span className="text-sm">{course.name}</span>
                            <span className="text-xs text-gray-400">{course.code}</span>
                        </li>
                    )}
                </ul>
            }
        </div>
    );
}

export default Courses;
