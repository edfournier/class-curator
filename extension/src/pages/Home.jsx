import { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa"; 
import FormField from "../components/FormField";
import SubmitBox from "../components/SubmitBox";
import { useAlerts } from "../providers/AlertProvider";

function Home() {
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState("");
    const [modified, setModified] = useState(false);
    const [formData, setFormData] = useState({});
    const alerts = useAlerts();

    function addTag() {
        // Ensure tag isn't duplicate or blank
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setModified(true);
        }
        setTag(""); 
    }

    function removeTag(target) {
        setTags(tags.filter(tag => tag !== target));
        setModified(true);
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setModified(true);
    }

    function handleSave(e) {
        e.preventDefault();
        if (modified) {
            // TODO: make API call
            // Use 'e.target.elements.major.value' to get form values
            setModified(false);
            alerts.info("Changes saved!");
        }
    }

    useEffect(() => {
        // TODO: make API call
        setTags([
            "Machine Learning",
            "Artificial Intelligence",
            "Data Science"
        ]);
        setFormData({
            major: "Computer Science",
            minor: "Linguistics",
            year: 2025
        });
    }, []); 

    return (
        <>
            <h1>{modified ? "Your Profile*" : "Your Profile"}</h1>
            <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSave} >
                <FormField value={formData.major} label="major" placeholder={"E.g. Computer Science"} onChange={handleFormChange} />
                <FormField value={formData.minor} label="minor" placeholder={"E.g. Linguistics"} onChange={handleFormChange}/>
                <FormField value={formData.year} label="year"  type={"number"} placeholder={"E.g. 2025"} onChange={handleFormChange}/>
                <SubmitBox 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onClick={addTag}
                    icon={<FaPlus />}
                    hint={"Enter a tag describing your interests..."}
                />
                {tags.length > 0 
                    && <div className="flex flex-wrap gap-1 overflow-y-auto max-h-20 pb-1">{
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
        </>
    );
}

export default Home;