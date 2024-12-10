function RecBubble({ code, reason }) {
    return (
        <div key={code} className="px-3 py-1 text-black rounded-full bg-indigo-200 flex items-center space-x-2" title={reason}>
            <span className="text-sm">{code}</span>
        </div>
    );

}

function Recommendations({ recs }) {   
    const bubbles = [
        recs.friends.map(entry => <RecBubble code={entry.course.code} reason={`Based on ${entry.networkCount} friends!`}/>),
        recs.tags.map(entry => <RecBubble code={entry.course.code} reason={`Based on your interests!`}/>),
        recs.peers.map(entry => <RecBubble code={entry.course.code} reason={`Based on ${entry.networkCount} similar peers!`}/>)
    ];

    const flat = bubbles.flat();
    if (flat.length == 0) {
        return <p className="mt-4">We don't have enough info to recommend a course yet. Explore the app more and check back soon!</p>
    }

    return (
        <>
            <p className="mt-4">We think you'd love these courses! Hover to see why.</p>
            <div className="flex flex-wrap gap-1 pt-2 pb-2">
                {bubbles.flat()}
            </div>
        </>
    );
}

export default Recommendations;