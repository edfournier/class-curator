import { useState } from "react";
import Navbar from "./Navbar";
import { FaTimes } from "react-icons/fa"; // 'x' icon

function Home() {
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState(""); // Captures user input

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
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-2 py-2">
                <h2 className="text-base text-white">What kinds of courses are you looking for?</h2>
                <div className="mt-4 flex items-center">
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="px-4 py-2 rounded-lg border-2 border-gray-300"
                        placeholder="Some cool topic..."
                    />
                    <button onClick={addTag} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                        <div
                            key={tag} 
                            className="px-4 py-2 rounded-full border-2 font-medium flex items-center gap-2 bg-gray-200 text-gray-700 border-gray-300"
                        >
                            <FaTimes onClick={() => removeTag(tag)} className="cursor-pointer" /> {tag}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;
