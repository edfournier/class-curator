import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa"; 
import FormField from "../components/FormField";
import SubmitBox from "../components/SubmitBox";
import { useAlerts } from "../providers/AlertProvider";

function Home() {
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState("");
    const [modified, setModified] = useState(false);
    const alerts = useAlerts()

    function addTag() {
        // Ensure tag isn't duplicate or blank
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setModified(true);
        }
        setTag(""); 
        alerts.error("Hey!");
    }

    function removeTag(target) {
        setTags(tags.filter(tag => tag !== target));
    }

    function handleChange() {
        setModified(true);
    }

    function handleSave(e) {
        // TODO: make API call
        e.preventDefault();
        console.log(e.target.elements.major.value);
        console.log(e.target.elements.minor.value);
        console.log(e.target.elements.year.value);
        setModified(false);
        alerts.info("Changes saved!");
    }

    // Map user's tags to clickable tiles
    const tagTiles = tags.map((tag) => (
        <div key={tag} className="px-3 py-1 text-black rounded-full bg-indigo-200 flex items-center space-x-2">
            <FaTimes onClick={() => removeTag(tag)} className="cursor-pointer hover:text-indigo-600"/> 
            <span className="text-sm">{tag}</span>
        </div>
    ));

    return (
        <>
            <h1>{modified ? "Your Profile*" : "Your Profile"}</h1>
            <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSave} >
                <FormField label="major" placeholder={"E.g. Computer Science"} onChange={handleChange} />
                <FormField label="minor" placeholder={"E.g. Linguistics"} onChange={handleChange}/>
                <FormField label="year"  type={"number"} placeholder={"E.g. 2025"} onChange={handleChange}/>
                <SubmitBox 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onClick={addTag}
                    icon={<FaPlus />}
                    hint={"Enter a tag describing your interests..."}
                />
                {tagTiles.length > 0 
                    && <div className="flex flex-wrap gap-1 overflow-y-auto max-h-20 pb-1">{tagTiles}</div>
                }
                <div className="flex justify-center">
                    <button type="submit" className="w-full">Save Changes</button>
                </div>
            </form>
        </>
    );
}

export default Home;