import { FaTimes } from "react-icons/fa"; 

function Friend({ friend, onClose }) {
    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            <div className="flex justify-between">
                <h2>{friend.name}</h2>
                <FaTimes onClick={onClose} className="cursor-pointer" />
            </div>
            <p className="text-sm text-gray-400 mb-2">{friend.email}</p>
        </div>
    );
}

export default Friend;