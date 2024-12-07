import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import FriendCard from "../components/FriendCard";
import SubmitBox from "../components/SubmitBox";
import PagableList from "../components/PagableList";
import { useAlerts } from "../providers/AlertProvider";

function Friends() {
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState(null);   // Current friend shown in expanded view
    const [email, setEmail] = useState("");       // Target of friend request
    const [requests, setRequests] = useState([]); // Incoming requests
    const alerts = useAlerts();

    function handleSendRequest() {
        // TODO: make API call
        setEmail("");
    }

    function handleDecideRequest(accepted) {
        // TODO: make API call
        if (accepted) {
            alerts.info(`Added ${requests[0].email}!`);
        }
        setRequests(requests.slice(1));
    }

    function handleUnfriend() {
        // TODO: make API call
        setFriends(friends.filter((e) => e.email !== friend.email));
        alerts.info(`Unfriended ${friend.email}!`);
        setFriend(null);
        setPage(1);
    }

    useEffect(() => {
        // TODO: replace with API calls
        setFriends([
            { name: "Alice", email: "alice@umass.edu" },
            { name: "Bob", email: "bob@umass.edu" },
            { name: "Charlie", email: "charlie@umass.edu" },
            { name: "David", email: "david@umass.edu" },
            { name: "Eva", email: "eva@umass.edu" }
        ]);

        setRequests([
            { name: "Johnny", email: "jappleseed@umass.edu" },
            { name: "Sally", email: "sally@umass.edu" }
        ]);
    }, []);

    return (
        <>
            <h1>Friend Requests</h1>
            <SubmitBox 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                onClick={handleSendRequest} 
                icon={<BsSendFill />} 
                hint={"Enter a UMass email address..."}
            />
            {requests.length > 0 && 
                <div className="bg-gray-900 p-3 rounded-md border-gray-700 mb-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{requests[0].email}</span>
                        <div className="flex space-x-3">
                            <FaCheck
                                className="text-green-500 cursor-pointer hover:text-green-600"
                                onClick={() => handleDecideRequest(true)}
                            />
                            <FaTimes
                                className="text-red-500 cursor-pointer hover:text-red-600"
                                onClick={() => handleDecideRequest(false)}
                            />
                        </div>
                    </div>
                </div>
            }

            <h1>Your Friends</h1>
            {friend 
                // Either render selected friend's card or the friends list
                ? <FriendCard friend={friend} setFriend={setFriend} onClose={() => setFriend(null)} onUnfriend={handleUnfriend}/>
                : <PagableList 
                    entries={friends} 
                    onClick={setFriend} 
                    mainKey={"name"}
                    subKey={"email"}
                    emptyMessage={"You have no friends!"}
                />
            }
        </>
    );
}

export default Friends;