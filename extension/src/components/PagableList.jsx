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
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-700 p-3 hover:bg-gray-700"
                        onClick={() => onClick(entry)}
                    >
                        <span className="mr-1 text-sm font-medium">{entry[mainKey]}</span>
                        <span className="text-right text-xs text-gray-400">{entry[subKey]}</span>
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
