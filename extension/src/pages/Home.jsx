import { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa"; 
import FormField from "../components/FormField";
import SubmitBox from "../components/SubmitBox";
import { useAlerts } from "../providers/AlertProvider";
import { getUserDetails, putUserDetails } from "../api/user.js";
import { getRecommendations } from "../api/recommendations.js";
import Recommendations from "../components/Recommendations.jsx";

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
        }
        else {
            alerts.error("New tags cannot be blank or duplicates!");
        }
        setTag(""); 
    }

    function removeTag(target) {
        setTags(tags.filter(tag => tag !== target));
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
                }
                await putUserDetails(details);
                setModified(false);
                alerts.info("Changes saved!");
            }
            catch (err) {
                console.error(err);
                alerts.error("Failed to save changes, please try again");
            }
        }
    }

    async function handleGetRecommendations() {
        try {
            const recs = await getRecommendations();
            setRecs(recs);
            console.log(recs);
        }
        catch (err) {
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
            }
            catch (err) {
                console.error(err);
                alerts.error("Failed to load user's details");
            }
        }

        load();
    }, []); 

    return (
        <>
            <h1>{modified ? "Your Profile*" : "Your Profile"}</h1>
            <form className="max-w-lg mx-auto space-y-4 mb-4" onSubmit={handleSave} >
                <FormField value={formData.major} label="major" placeholder={"E.g. Computer Science"} onChange={handleFormChange} />
                <FormField value={formData.minor} label="minor" placeholder={"E.g. Linguistics"} onChange={handleFormChange}/>
                <FormField value={formData.year} label="year"  type={"number"} placeholder={"E.g. 2025"} onChange={handleFormChange}/>
                <FormField value={formData.semester} label="semester" type={"text"} placeholder={"E.g. SPRING"} onChange={handleFormChange}/>
                <SubmitBox 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onClick={addTag}
                    icon={<FaPlus />}
                    hint={"Enter a tag describing your interests..."}
                />
                {tags.length > 0 
                    && <div className="flex flex-wrap gap-1 overflow-y-auto max-h-28 pt-2 pb-2 border-b-[1px] border-t-[1px] border-gray-700">{
                        // Map user's tags to clickable tiles
                        tags.map((tag) => 
                            <div key={tag} className="px-3 py-1 text-black rounded-full bg-indigo-200 flex items-center space-x-2">
                                <FaTimes onClick={() => removeTag(tag)} className="cursor-pointer hover:text-indigo-600"/> 
                                <span className="text-sm">{tag}</span>
                            </div>
                        )
                    }</div>
                }
                <div className="flex justify-center">
                    <button type="submit" className="w-full">Save Changes</button>
                </div>
            </form>

            <h1>Recommendations</h1>
            <div className="flex justify-center">
                <button onClick={handleGetRecommendations}>Get Recommendations!</button>
            </div>
            {Object.keys(recs).length > 0 && <Recommendations recs={recs} />}
        </>
    );
}

export default Home;