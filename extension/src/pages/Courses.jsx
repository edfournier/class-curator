import { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import { useLocation } from "react-router-dom";
import { fetchCourse, fetchCourseResults } from "../api/courses";
import CourseCard from "../components/CourseCard";
import SubmitBox from "../components/SubmitBox";
import PagableList from "../components/PagableList";

function Courses() {
    const location = useLocation();
    const [query, setQuery] = useState(location?.state?.course || ""); // Handles open-popup trigger
    const [course, setCourse] = useState(null); 
    const [results, setResults] = useState(null); 

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
        <>
            <h1>Course Search</h1> 
            <SubmitBox 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={search}
                icon={<FaSearch />}
                hint={"Search a course by code or name..."}
            />
            {results && (course 
                // Either render the search results or the selected course's page
                ? <CourseCard course={course} setCourse={setCourse} onClose={() => setCourse(null)}/>
                : <PagableList 
                    entries={results}
                    onClick={showCourse}
                    emptyMessage={"No matching results found!"}
                    mainKey={"name"}
                    subKey={"code"}
                />
            )}
        </>
    );
}

export default Courses;
