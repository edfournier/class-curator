import { FaTimes } from "react-icons/fa"; 

// TODO: highlight classes that you have common interests

function Friend({ friend, onClose, onUnfriend }) {
    const interests = [
        { name: "Data Structures", code: "CS 187" },
        { name: "Algorithms", code: "CS 201" },
        { name: "Operating Systems", code: "CS 350" },
        { name: "Machine Learning", code: "CS 500" }
    ];

    return (
        <div className="bg-gray-900 p-3 rounded-md border-gray-700">
            <div className="flex justify-between mb-4">
                <p className="text-xs text-gray-400">
                    {friend.email}
                </p>
                <FaTimes onClick={onClose} className="cursor-pointer hover:text-indigo-600" />
            </div>
            <h2 className="border-b-[1px] border-gray-700 mb-3">
                {friend.name}'s Interests
            </h2>
            <ul className="overflow-y-auto max-h-36 mb-6 space-y-2 mr-1">
                {interests.length === 0 
                    ? <span className="font-semibold text-indigo-200">{friend.name} has no interests!</span>
                    : interests.map((interest, i) => 
                        <li key={i}>
                            <span className="font-semibold text-indigo-200">{interest.name}</span>
                            <span className="text-gray-400"> {interest.code}</span>
                        </li>
                    )
                }
            </ul>
            <div className="flex justify-center">
                <button onClick={onUnfriend} className="w-20 hover:bg-red-500">
                    Unfriend
                </button>
            </div>
        </div>
    );
}

export default Friend;