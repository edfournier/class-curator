import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; 
import { useLocation } from "react-router-dom";
import { getCourseResults } from "../api/courses";
import CourseCard from "../components/CourseCard";
import SubmitBox from "../components/SubmitBox";
import PagableList from "../components/PagableList";
import { useAlerts } from "../providers/AlertProvider";

function Courses() {
    const alerts = useAlerts();
    const location = useLocation();
    const [course, setCourse] = useState(null);    // Details and insights of the course being shown in card view
    const [results, setResults] = useState(null);  // Search results from given query
    const [query, setQuery] = useState(""); 

    // Handle case popup was opened from SPIRE

    const redirect = location?.state?.course;   
    if (redirect) {
        location.state.course = null;
        setCourse(redirect);
        setQuery(redirect.code);
        setResults([redirect]);
    }

    async function search() {
        try {
            // Fetch top results from user query
            const courses = await getCourseResults(query);
            setResults(courses);
            setCourse(null);
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to execute query, please try again");
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
                hint={"Search a course by code..."}
            />
            {results && (course 
                // Either render the search results or the selected course's page
                ? <CourseCard 
                    course={course}  
                    onClose={() => setCourse(null)}
                />
                : (<>
                    <p className={"text-indigo-200 font-semibold mb-2"}>Found {results.length} results!</p>
                    <PagableList 
                        entries={results}
                        onClick={setCourse}
                        mainKey={"name"}
                        subKey={"code"}
                    />
                </>

                )
            )}
        </>
    );
}

export default Courses;