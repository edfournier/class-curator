import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import Friend from "../components/Friend";
import Pager from "../components/Pager";
import SubmitBox from "../components/SubmitBox";

function Friends() {
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState(null);   // Current friend shown in expanded view
    const [email, setEmail] = useState("");       // Target of friend request
    const [page, setPage] = useState(1);          // Current page of visible friends
    const [requests, setRequests] = useState([]); // Incoming requests

    const maxTiles = 4;
    const last = page * maxTiles;
    const first = last - maxTiles;
    const visibleFriends = friends.slice(first, last);

    function requestFriend() {
        // TODO: make API call
        setEmail("");
    }

    function removeFriend(target) {
        // TODO: make API call
        setFriends(friends.filter((friend) => friend.email !== target));
    }

    function handleRequest(accepted) {
        // TODO: make api calls
        if (accepted) {
            setFriends([...friends, requests]);
        }
        setRequests(requests.slice(1));
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
                onClick={requestFriend} 
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
                                onClick={() => handleRequest(true)}
                            />
                            <FaTimes
                                className="text-red-500 cursor-pointer hover:text-red-600"
                                onClick={() => handleRequest(false)}
                            />
                        </div>
                    </div>
                </div>
            }

            <h1>Your Friends</h1>
            {friend 
                // Either render selected friend's page or the friends list
                ? <Friend friend={friend} setFriend={setFriend} onClose={() => setFriend(null)}/>
                : <>
                    <ul className="space-y-1">
                        {visibleFriends.map((friend) => 
                            <li 
                                key={friend.email} 
                                className="flex justify-between p-3 border border-gray-700 hover:bg-gray-700 rounded-lg cursor-pointer" 
                                onClick={() => setFriend(friend)}
                            >
                                <span className="text-sm font-medium">{friend.name}</span>
                                <span className="text-xs text-gray-400">{friend.email}</span>
                            </li>
                        )}
                    </ul>
                    <Pager 
                        onLeft={() => setPage(page - 1)} 
                        onRight={() => setPage(page + 1)} 
                        leftOff={page <= 1} 
                        rightOff={last >= friends.length} 
                    />
                </>
            }
        </>
    );
}

export default Friends;