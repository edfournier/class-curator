import { useState, useEffect } from "react";
import { FaTimes, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa"; 
import { getCourseDetails, getCourseInsights, postCourseInterest, postCourseRating } from "../api/courses";
import { useAlerts } from "../providers/AlertProvider";
import CourseRatingChart from "./CourseRatingChart";

function CourseCard({ course, onClose }) {
    const alerts = useAlerts();
    const [thumb, setThumb] = useState("");
    const [isInterested, setIsInterested] = useState(false);  
    const [details, setDetails] = useState({});
    const [insights, setInsights] = useState({});

    async function handleThumb(type) {
        try {
            await postCourseRating(course.id, type);
            setThumb(type === thumb ? "" : type);
        }
        catch (err) {
            console.error(err);
            alerts.err("Failed to register rating, please try again");
        }
    }

    async function handleInterest() {
        try {
            await postCourseInterest(course.id, isInterested);
            setIsInterested(!isInterested); 
        }
        catch (err) {
            console.error(err);
            alerts.err("Failed to register interest, please try again");
        }
    }

    useEffect(() => {
        async function load() {
            try {
                // Get details and insights for clicked course 
                const [details, insights] = await Promise.all([
                    getCourseDetails(course.id),
                    getCourseInsights(course.id)
                ]);
                setDetails(details),
                setInsights(insights);
            }
            catch (err) {
                console.error(err);
                alerts.error("Failed to get course details and insights");
            }
        }

        load();
    }, []);

    return (
        <div className="card">
            <div className="flex justify-between">
                <p className="text-xs text-gray-400">{course.code}</p>
                <FaTimes aria-label="close" onClick={onClose} className="cursor-pointer hover:text-indigo-600" />
            </div>
            <h2 className="mb-3 mt-2">{course.name}</h2>
            <div className="mb-2 flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                    <button className="p-1" onClick={() => handleThumb("up")}>
                        {thumb === "up" ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    </button>
                    <span>{details.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-1" onClick={() => handleThumb("down")}>
                        {thumb === "down" ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    </button>
                    <span>{details.dislikes}</span>
                </div>
            </div>
            <p className="flex-grow mb-2">{details.description}</p>
            {insights.prof && 
                <><span>Best Professor:</span> <span className="text-indigo-200">{insights.prof}</span></> 
            }
            <CourseRatingChart data={insights.data} />
            <div className="mt-3 flex justify-center">
                <button
                    onClick={handleInterest}
                    className={isInterested ? "py-1" : "py-1 bg-gray-600 text-gray-300 hover:bg-gray-500"}
                >
                    I'm Interested!
                </button>
            </div>
        </div>
    );
}

export default CourseCard;