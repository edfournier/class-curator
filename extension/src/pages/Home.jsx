import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa"; 
import FormField from "../components/FormField";

function Home() {
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState("");

    const tagTiles = tags.map((tag) => (
        <div
            key={tag}
            className="px-3 py-1 text-black rounded-full bg-indigo-100 font-medium flex items-center space-x-2"
        >
            <FaTimes 
                onClick={() => removeTag(tag)} 
                className="cursor-pointer text-black hover:text-indigo-600"
            /> 
            <span className="text-sm font-medium">{tag}</span>
        </div>
    ));

    function addTag() {
        // Ensure tag isn't duplicate or blank
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setTag(""); 
    }

    function removeTag(target) {
        setTags(tags.filter(tag => tag !== target));
    }

    function save(e) {
        // TODO: make API call
        e.preventDefault();
        console.log(e.target.elements.major.value);
        console.log(e.target.elements.minor.value);
        console.log(e.target.elements.year.value);
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-3">
            <h1>Your Profile</h1>
            <form className="max-w-lg mx-auto space-y-4" onSubmit={save}>
                <FormField label="major" type={"text"} placeholder={"E.g. Computer Science"}/>
                <FormField label="minor" type={"text"} placeholder={"E.g. Linguistics"}/>
                <FormField label="year"  type={"number"} placeholder={"E.g. 2025"}/>
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