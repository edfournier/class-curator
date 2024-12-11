/**
 * A small buble containing the course code and a tooltip
 */
function RecBubble({ code, reason }) {
    return (
        <div className="flex items-center space-x-2 rounded-full bg-indigo-200 px-3 py-1 text-black" title={reason}>
            <span className="text-sm">{code}</span>
        </div>
    );
}

/**
 * Displays course recommendations as bubbles and the reasons why they were chosen
 */
function Recommendations({ recs }) {
    // Map courses to bubbles, each with customized tool tip
    const bubbles = [
        recs.friends.map((entry) => (
            <RecBubble
                key={entry.course.code}
                code={entry.course.code}
                reason={`Based on ${entry.networkCount} friends!`}
            />
        )),
        recs.tags.map((entry) => (
            <RecBubble key={entry.course.code} code={entry.course.code} reason={`Based on your tags!`} />
        )),
        recs.peers.map((entry) => (
            <RecBubble
                key={entry.course.code}
                code={entry.course.code}
                reason={`Based on ${entry.networkCount} similar peers!`}
            />
        ))
    ];

    // If no recommendations are available, display a fallback message
    const flat = bubbles.flat();
    if (flat.length == 0) {
        return (
            <p className="mt-4 font-semibold text-indigo-200">
                We don't have enough info to recommend a course yet. Explore the app more and check back soon!
            </p>
        );
    }

    return (
        <>
            <p className="mt-4 font-semibold text-indigo-200">We think you'd love these courses! Hover to see why.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1 pt-2">{flat}</div>
        </>
    );
}

export default Recommendations;
