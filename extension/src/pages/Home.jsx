import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa"; 
import FormField from "../components/FormField";

function Home() {
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState("");
    const [modified, setModified] = useState(false);

    function addTag() {
        // Ensure tag isn't duplicate or blank
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            handleChange();
        }
        setTag(""); 
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
    }

    // Map user's tags to clickable tiles
    const tagTiles = tags.map((tag) => (
        <div key={tag} className="px-3 py-1 text-black rounded-full bg-indigo-100 flex items-center space-x-2">
            <FaTimes onClick={() => removeTag(tag)} className="cursor-pointer hover:text-indigo-600"/> 
            <span className="text-sm">{tag}</span>
        </div>
    ));

    return (
        <div className="max-w-4xl mx-auto px-6 py-3">
            <h1>{modified ? "Your Profile*" : "Your Profile"}</h1>
            <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSave} >
                <FormField label="major" placeholder={"E.g. Computer Science"} onChange={handleChange} />
                <FormField label="minor" placeholder={"E.g. Linguistics"} onChange={handleChange}/>
                <FormField label="year"  type={"number"} placeholder={"E.g. 2025"} onChange={handleChange}/>
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-60"
                        placeholder="Enter a tag describing your interests..."
                    />
                    <button type="button" onClick={addTag} className="ml-1"><FaPlus /></button>
                </div>
                {tagTiles.length > 0 
                    && <div className="flex flex-wrap gap-1 overflow-y-auto max-h-20">{tagTiles}</div>
                }
                <button type="submit" className="w-full">Save Changes</button>
            </form>
        </div>
    );
}

export default Home;