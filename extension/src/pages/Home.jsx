import { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import FormField from "../components/FormField";
import SubmitBox from "../components/SubmitBox";
import { useAlerts } from "../providers/AlertProvider";
import { getUserDetails, putUserDetails } from "../api/user.js";
import { getRecommendations } from "../api/recommendations.js";
import Recommendations from "../components/Recommendations.jsx";

/**
 * The main home page: renders recommendations and user profile
 */
function Home() {
    const alerts = useAlerts();
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");
    const [modified, setModified] = useState(false);
    const [formData, setFormData] = useState({});
    const [recs, setRecs] = useState({});

    function addTag() {
        // Ensure tag isn't duplicate or blank
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setModified(true);
        } else {
            alerts.error("New tags cannot be blank or duplicates!");
        }
        setTag("");
    }

    function removeTag(target) {
        setTags(tags.filter((tag) => tag !== target));
        setModified(true);
    }

    function handleFormChange(e) {
        // Add new key's value to form data
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setModified(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        if (modified) {
            try {
                // Send new details to backend
                const details = {
                    major: e.target.elements.major.value,
                    minor: e.target.elements.minor.value,
                    gradSemester: e.target.elements.semester.value,
                    gradYear: Number(e.target.elements.year.value),
                    tags: tags.join(",")
                };
                await putUserDetails(details);
                setModified(false);
                alerts.info("Changes saved!");
            } catch (err) {
                console.error(err);
                alerts.error("Failed to save changes, please try again");
            }
        }
    }

    async function handleGetRecommendations() {
        try {
            const recs = await getRecommendations();
            setRecs(recs);
        } catch (err) {
            console.error(err);
            alerts.error("Failed to get recommendations, please try again");
        }
    }

    useEffect(() => {
        async function load() {
            try {
                // Load user details from backend
                const userDetails = await getUserDetails();
                setTags(userDetails.tags ? userDetails.tags.split(",") : []);
                setFormData({
                    major: userDetails.major,
                    minor: userDetails.minor,
                    year: userDetails.gradSession.year,
                    semester: userDetails.gradSession.semester
                });
            } catch (err) {
                console.error(err);
                alerts.error("Failed to load user's details");
            }
        }

        load();
    }, []);

    return (
        <>
            <h1>Recommendations</h1>
            <div className="flex justify-center">
                <button onClick={handleGetRecommendations}>Get Recommendations!</button>
            </div>
            {Object.keys(recs).length > 0 && <Recommendations recs={recs} />}
            <h1 className="mt-4">{modified ? "Your Profile*" : "Your Profile"}</h1>
            <form className="mx-auto mb-4 max-w-lg space-y-4" onSubmit={handleSave}>
                <FormField
                    value={formData.major || ""}
                    label="major"
                    placeholder={"E.g. Computer Science"}
                    onChange={handleFormChange}
                />
                <FormField
                    value={formData.minor || ""}
                    label="minor"
                    placeholder={"E.g. Linguistics"}
                    onChange={handleFormChange}
                />
                <FormField
                    value={formData.year || 2024}
                    label="year"
                    type={"number"}
                    placeholder={"E.g. 2025"}
                    onChange={handleFormChange}
                />
                <div className="flex items-center space-x-4">
                    <label htmlFor="semester" className="w-20 text-center text-sm font-medium">
                        Semester
                    </label>
                    <select
                        value={formData.semester}
                        onChange={handleFormChange}
                        className="w-full"
                        id="semester"
                        name="semester"
                    >
                        <option value="FALL">Fall</option>
                        <option value="SPRING">Spring</option>
                    </select>
                </div>
                <SubmitBox
                    label={"add-tag"}
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onClick={addTag}
                    icon={<FaPlus />}
                    hint={"Enter a tag describing your interests..."}
                />
                {tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 pb-2 pt-2">
                        {
                            // Map user's tags to clickable bubbles
                            tags.map((tag) => (
                                <div
                                    key={tag}
                                    className="flex items-center space-x-2 rounded-full bg-indigo-200 px-3 py-1 text-black"
                                >
                                    <FaTimes
                                        onClick={() => removeTag(tag)}
                                        className="cursor-pointer hover:text-indigo-600"
                                    />
                                    <span className="text-sm">{tag}</span>
                                </div>
                            ))
                        }
                    </div>
                )}
                <div className="flex justify-center">
                    <button type="submit">Save Changes</button>
                </div>
            </form>
        </>
    );
}

export default Home;
