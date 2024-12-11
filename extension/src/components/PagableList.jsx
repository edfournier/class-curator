import Pager from "../components/Pager";
import { useState } from "react";

/**
 * Displays a paginated list of entries, with built in pager for navigation
 */
function PagableList({ entries, onClick, mainKey, subKey, emptyMessage }) {   
    const [page, setPage] = useState(1); // Current visible page

    const maxTiles = 4;
    const last = page * maxTiles;
    const first = last - maxTiles;

    // Display a message if there are no entries
    if (entries.length === 0) {
        return <span className="font-semibold text-indigo-200">{emptyMessage}</span>;
    }

    return (
        <>
            <ul className="space-y-1">
                {entries.slice(first, last).map((entry) => (
                    <li
                        key={entry[subKey]}
                        className="flex items-center justify-between p-3 border border-gray-700 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => onClick(entry)}
                    >
                        <span className="text-sm font-medium mr-1">{entry[mainKey]}</span>
                        <span className="text-xs text-gray-400 text-right">{entry[subKey]}</span>
                    </li>
                ))}
            </ul>
            <Pager
                onLeft={() => setPage(page - 1)}
                onRight={() => setPage(page + 1)}
                leftOff={page <= 1}
                rightOff={last >= entries.length}
            />
        </>
    );
}

export default PagableList;