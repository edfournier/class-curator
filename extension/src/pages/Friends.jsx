import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";
import Friend from "../components/Friend";

function Friends() {
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState(null);
    const [email, setEmail] = useState("");
    const [page, setPage] = useState(1);

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

    useEffect(() => {
        // TODO: replace with API call
        setFriends([
            { name: "Alice", email: "alice@umass.edu" },
            { name: "Bob", email: "bob@umass.edu" },
            { name: "Charlie", email: "charlie@umass.edu" },
            { name: "David", email: "david@umass.edu" },
            { name: "Eva", email: "eva@umass.edu" }
        ]);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-6 py-3">
            <h1>Friend Requests</h1>
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-60"
                    placeholder="Enter a UMass email address..."
                />
                <button onClick={requestFriend} className="ml-1"><BsSendFill /></button>
            </div>

            <h1>Your Friends</h1>
            {friend 
                // Either render selected friend's page or the friends list
                ? <Friend friend={friend} setFriend={setFriend} />
                : <>
                    <ul className="space-y-1">
                        {visibleFriends.map((friend) => 
                            <li key={friend.email} className="flex justify-between" onClick={() => setFriend(friend)}>
                                <span className="text-sm font-medium">{friend.name}</span>
                                <span className="text-xs text-gray-400">{friend.email}</span>
                            </li>
                        )}
                    </ul>
                    <div className="flex justify-center mt-4">
                        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="mr-1 disabled:opacity-50">
                            <IoArrowBackSharp />
                        </button>
                        <button disabled={last >= friends.length} onClick={() => setPage(page + 1)} className="ml-1 disabled:opacity-50">
                            <IoArrowForwardSharp />
                        </button>
                    </div>
                </>
            }
        </div>
    );
}

export default Friends;