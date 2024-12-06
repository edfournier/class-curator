import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BsSendFill } from "react-icons/bs";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

function Friends() {
    const [friends, setFriends] = useState(null);
    const [email, setEmail] = useState("");
    const [page, setPage] = useState(1);

    const maxTiles = 3;
    const last = page * maxTiles;
    const first = last - maxTiles;
    const tiles = friends?.slice(first, last)?.map(({ email, name }) => 
        <div 
            key={email} 
            className="flex justify-between items-center p-3 rounded-lg bg-gray-700 shadow-md"
        >
            <span className="font-semibold">{name} ({email})</span>
            <FaTimes onClick={() => removeFriend(email)} className="cursor-pointer" />
        </div>
    );

    function requestFriend() {
        // TODO: make API call
        console.log(email);
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
            { name: "Eve", email: "eve@umass.edu" },
        ]);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-60"
                    placeholder="Enter a UMass email to friend..."
                />
                <button onClick={requestFriend} className="ml-1"><BsSendFill /></button>
            </div>

            <h1>Your Friends</h1>
            <div className="space-y-2">{tiles}</div>
            {friends && (
                <div className="flex justify-center mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="mr-1 disabled:opacity-50"
                    >
                        <IoArrowBackSharp />
                    </button>
                    <button
                        disabled={last >= friends.length}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="ml-1 disabled:opacity-50"
                    >
                        <IoArrowForwardSharp />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Friends;