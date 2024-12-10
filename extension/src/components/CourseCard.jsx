import { useState, useEffect } from "react";
import { FaTimes, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa"; 
import { getCourseDetails, getCourseInsights, putCourseInterest, deleteCourseInterest, postCourseRating } from "../api/courses";
import { useAlerts } from "../providers/AlertProvider";
import CourseRatingChart from "./CourseRatingChart";

function CourseCard({ course, onClose }) {
    const alerts = useAlerts();
    const [vote, setVote] = useState(0); // -1 for down, 1 for up, 0 for undecided
    const [isInterested, setIsInterested] = useState(false);  
    const [details, setDetails] = useState({});
    const [insights, setInsights] = useState({});

    // Handles voting on the course, allowing users to like or dislike.
    async function handleVote(value) {
        try {   
            const newVote = value === vote ? 0 : value;
            await postCourseRating(course.code, newVote);
            setDetails({
                ...details,
                upvotes: details.upvotes + (vote === 1 ? -1 : 0) + (newVote === 1 ? 1 : 0),
                downvotes: details.downvotes + (vote === -1 ? -1 : 0) + (newVote === -1 ? 1 : 0)
            });
            setVote(newVote);
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to register rating, please try again");
        }
    }

    // Toggles the user's interest in the course.
    async function handleInterest() {
        try {
            // Send corresponding request
            if (!isInterested) {
                await putCourseInterest(course.code);
            }
            else {
                await deleteCourseInterest(course.code);
            }
            setIsInterested(!isInterested); 
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to register interest, please try again");
        }
    }

    // Fetches course details and insights when the component is mounted.
    useEffect(() => {
        async function load() {
            try {
                // Get details and insights for clicked course 
                const [details, insights] = await Promise.all([
                    getCourseDetails(course.code),
                    getCourseInsights(course.code)
                ]);
                setVote(details.userRating);
                setDetails(details);
                setInsights(insights);
                setIsInterested(details.interested);
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
                    <button aria-label="like" className="p-1" onClick={() => handleVote(1)}>
                        {vote === 1 ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    </button>
                    <span>{details.upvotes}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button aria-label="dislike" className="p-1" onClick={() => handleVote(-1)}>
                        {vote === -1 ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    </button>
                    <span>{details.downvotes}</span>
                </div>
            </div>
            <p className="flex-grow mb-2">{details.course?.description}</p>

            <h2 className="mb-3 mt-2">Historical Data</h2>
            <CourseRatingChart data={insights.ratingHistory} /> 

            <h2 className="mt-2">Professor Rankings</h2>
            <em className="mt-1">(Ratings out of 10, reward those with consistently high scores across multiple sessions)</em>
            <ul className="mt-1">
                {insights.profRatings && Object.keys(insights.profRatings).length > 0
                    ? Object.keys(insights.profRatings).map(prof => {
                        const quality = insights.profRatings[prof];
                        return <li key={prof}>
                            <span className={"font-semibold text-indigo-500"}>{prof}</span>
                            <span className="text-gray-400"> {quality}</span>
                        </li>
                    })
                    : <span className="font-semibold text-indigo-200">No professor rankings yet!</span>
                }
            </ul>
            <div className="mt-4 flex justify-center">
                <button
                    aria-label="interest"
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