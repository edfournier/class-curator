import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { FaTimes } from "react-icons/fa";
import { BsSendFill } from "react-icons/bs";

function Friends() {
    const [friends, setFriends] = useState(null);
    const [email, setEmail] = useState("");
    const [page, setPage] = useState(1);

    const maxTiles = 3
    const last = page * maxTiles;
    const first = last - maxTiles;
    const tiles = friends?.slice(first, last)?.map(({ email, name }) => 
        <div key={email} className="flex justify-between items-center bg-gray-900 text-white p-2 rounded-lg border border-gray-700" >
            <span>{name} ({email})</span>
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
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-2 py-3">
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-60"
                        placeholder="Enter a UMass email to friend..."
                    />
                    <button onClick={requestFriend} className="ml-1">
                        <BsSendFill />
                    </button>
                </div>

                <div className="space-y-1">{tiles}</div>

                {friends && (
                    <div className="flex justify-center mt-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="mr-2 disabled:opacity-10"
                        >
                            Back
                        </button>
                        <button
                            disabled={last >= friends.length}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="disabled:opacity-10"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Friends;