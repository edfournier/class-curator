/**
 * A small buble containing the course code and a tooltip
 */
function RecBubble({ code, reason }) {
    return (
        <div className="px-3 py-1 text-black rounded-full bg-indigo-200 flex items-center space-x-2" title={reason}>
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
        recs.friends.map(entry => <RecBubble key={entry.course.code} code={entry.course.code} reason={`Based on ${entry.networkCount} friends!`}/>),
        recs.tags.map(entry => <RecBubble key={entry.course.code} code={entry.course.code} reason={`Based on your tags!`}/>),
        recs.peers.map(entry => <RecBubble key={entry.course.code} code={entry.course.code} reason={`Based on ${entry.networkCount} similar peers!`}/>)
    ];

    // If no recommendations are available, display a fallback message
    const flat = bubbles.flat();
    if (flat.length == 0) {
        return <p className="mt-4 font-semibold text-indigo-200">We don't have enough info to recommend a course yet. Explore the app more and check back soon!</p>
    }

    return (
        <>  
            <p className="mt-4 font-semibold text-indigo-200">We think you'd love these courses! Hover to see why.</p>
            <div className="flex justify-center flex-wrap gap-1 pt-2 mt-2">
                {flat}
            </div>
        </>
    );
}

export default Recommendations;