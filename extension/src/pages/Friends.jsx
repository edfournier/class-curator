import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import FriendCard from "../components/FriendCard";
import SubmitBox from "../components/SubmitBox";
import PagableList from "../components/PagableList";
import { useAlerts } from "../providers/AlertProvider";
import { deleteFriend, getFriends, getIncomingRequests, postFriendRequest, postRequestDecision } from "../api/friends";
import { getCurrentUserInterests } from "../api/user";

/**
 * The main friend page: renders friends and friend requests
 */
function Friends() {
    const alerts = useAlerts();
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState(null);             // Current friend shown in card view
    const [email, setEmail] = useState("");                 // Target of friend request
    const [requests, setRequests] = useState([]);           // Incoming friend requests
    const [userInterests, setUserInterests] = useState([]); // Interests of logged in user

    async function handleSendRequest() {
        try {
            // Check email isn't invalid
            if (!email.includes("@umass.edu")) {
                alerts.error("Please enter a valid UMass email, e.g. edfournier@umass.edu");
            }
            else {
                // Notify backend of new request
                await postFriendRequest(email);
                alerts.info(`Sent request to ${email}!`);
            }
            setEmail("");
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to send friend request");
        }
    }

    async function handleDecideRequest(isAccepted) {
        try {
            // Notify backend of accept/deny
            await postRequestDecision(requests[0].id, isAccepted);
            if (isAccepted) {
                alerts.info(`Added ${requests[0].username}!`);
                setFriends([...friends, requests[0]]);
            }

            // Show next request
            setRequests(requests.slice(1)); 
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to respond to request, please try again");
        }
    }

    async function handleUnfriend() {
        try {
            // Notify backend to unfriend
            await deleteFriend(friend.id);
            setFriends(friends.filter(({ username }) => username !== friend.username));
            setFriend(null);
            alerts.info(`Unfriended ${friend.username}!`);
        }
        catch (err) {
            console.error(err);
            alerts.error("Failed to unfriend, please try again");
        }
    }

    useEffect(() => {
        async function load() {
            try {
                // Load user's friends and requests 
                const [friends, requests, userInterests] = await Promise.all(
                    [getFriends(), getIncomingRequests(), getCurrentUserInterests()]
                );
                setFriends(friends);
                setRequests(requests);
                setUserInterests(userInterests);
            }
            catch (err) {
                console.error(err);
                alerts.error("Failed to load user's friends");
            }
        }

        load();
    }, []);

    return (
        <>
            <h1>Friend Requests</h1>
            <SubmitBox 
                label={"send"}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                onClick={handleSendRequest} 
                icon={<BsSendFill />} 
                hint={"Enter a UMass email address..."}
            />
            {requests.length > 0 && 
                <div className="bg-gray-900 p-3 rounded-md border-[1px] border-gray-700 mb-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{requests[0].username}</span>
                        <div className="flex space-x-3">
                            <FaCheck
                                aria-label="accept"
                                className="text-green-500 cursor-pointer hover:text-green-600"
                                onClick={() => handleDecideRequest(true)}
                            />
                            <FaTimes
                                aria-label="deny"
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
                ? <FriendCard 
                    friend={friend} 
                    userInterests={userInterests}
                    onClose={() => setFriend(null)} 
                    onUnfriend={handleUnfriend}
                />
                : <PagableList 
                    entries={friends} 
                    onClick={setFriend} 
                    mainKey={"displayName"}
                    subKey={"username"}
                    emptyMessage={"You have no friends!"}
                />
            }
        </>
    );
}

export default Friends;