import Pager from "../components/Pager";
import { useState } from "react";

function FriendsList({ friends, onClick }) {   
    const [page, setPage] = useState(1); // Current page of visible friends

    const maxTiles = 4;
    const last = page * maxTiles;
    const first = last - maxTiles;

    if (friends.length === 0) {
        return <span className="font-semibold text-indigo-200">You have no friends!</span>;
    }

    return (
        <>
            <ul className="space-y-1">
                {friends.slice(first, last).map((friend) => (
                    <li
                        key={friend.email}
                        className="flex justify-between p-3 border border-gray-700 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => onClick(friend)}
                    >
                        <span className="text-sm font-medium">{friend.name}</span>
                        <span className="text-xs text-gray-400">{friend.email}</span>
                    </li>
                ))}
            </ul>
            <Pager
                onLeft={() => setPage(page - 1)}
                onRight={() => setPage(page + 1)}
                leftOff={page <= 1}
                rightOff={last >= friends.length}
            />
        </>
    );
}

export default FriendsList;