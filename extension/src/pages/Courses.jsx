import { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import { useLocation } from "react-router-dom";
import { getCourseDetails, getCourseResults } from "../api/courses";
import CourseCard from "../components/CourseCard";
import SubmitBox from "../components/SubmitBox";
import PagableList from "../components/PagableList";
import { useAlerts } from "../providers/AlertProvider";

function Courses() {
    const location = useLocation();
    const alerts = useAlerts();
    const [query, setQuery] = useState(location?.state?.course || ""); // Handles open-popup trigger
    const [course, setCourse] = useState(null); 
    const [results, setResults] = useState(null); 

    async function search() {
        try {
            // Fetch top results from user query
            const courses = await getCourseResults(query);
            setResults(courses);
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to execute query, please try again");
        }
    }

    async function showCourse(course) {
        try {
            // Get details for clicked course 
            const result = await getCourseDetails(course.id);
            setCourse(result);
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to get course details, please try again");
        }
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
                ? <CourseCard 
                    course={course}  
                    onClose={() => setCourse(null)}
                />
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