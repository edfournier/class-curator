import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa"; 
import { getUserInterests } from "../api/user";
import { useAlerts } from "../providers/AlertProvider";

// TODO: highlight classes that you have common interests

function FriendCard({ friend, userInterests, onClose, onUnfriend }) {
    const alerts = useAlerts();
    const [friendInterests, setFriendInterests] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const friendInterests = await getUserInterests(friend.email);

                // Find intersection of logged-in user and this friend's interests
                for (const interest of friendInterests) {
                    interest.isCommon = userInterests.some(({ code }) => code === interest.code);
                }
                setFriendInterests(friendInterests);
            } 
            catch (err) {
                console.error(err);
                alerts.error("Failed to get friend's interests");
            }
        }

        load();
    }, []);

    return (
        <div className="card">
            <div className="flex justify-between">
                <p className="text-xs text-gray-400">{friend.email}</p>
                <FaTimes onClick={onClose} className="cursor-pointer hover:text-indigo-600" />
            </div>
            <h2 className="mb-3 mt-2">{friend.name}'s Interests</h2>
            <ul className="overflow-y-auto max-h-36 mb-6 space-y-1 mr-1 ml-2">
                {friendInterests.length === 0 
                    ? <span className="font-semibold text-indigo-200">{friend.name} has no interests!</span>
                    : friendInterests.map((interest) => {
                        return (
                            <li key={interest.code}>
                                <span
                                    className={`font-semibold ${interest.isCommon ? "text-indigo-500" : "text-indigo-200"}`}
                                    title={interest.isCommon ? "You're both interested in this course!" : ""}
                                >
                                    {interest.name}
                                </span>
                                <span className="text-gray-400"> {interest.code}</span>
                            </li>
                        );
                    })
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

export default FriendCard;