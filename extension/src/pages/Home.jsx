import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa"; 
import UserForm from "../components/UserForm";

function Home() {
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState("");

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

    return (
        <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-60"
                    placeholder="Enter a tag describing your interests..."
                />
                <button onClick={addTag} className="ml-1"><FaPlus /></button>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <div
                        key={tag} 
                        className="px-4 py-2 rounded-full border-gray-300 bg-gray-200 font-medium flex items-center gap-2"
                    >
                        <FaTimes onClick={() => removeTag(tag)} className="cursor-pointer" /> {tag}
                    </div>
                ))}
            </div>

            <h1>Your Profile</h1>
            <UserForm />
        </div>
    );
}

export default Home;
