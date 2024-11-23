/*
 * TODO
 *  - display like/dislikes
 *  - "open in extension" button that opens extension and populates it with data
 */

function embed() {
    console.log("Parsing course search results...");
    const courses = []
    const first = document.getElementById("PTS_RSLTS_LIST$0_row_0"); // First search result
    if (first) {
        const results = first.parentElement;
        results.childNodes.forEach((result) => 
            courses.push({ 
                title: result.querySelector("p[hidden]").textContent.trim().replace(/\s+/g, ' '), // Removes excess whitespace
                element: result.querySelector(".ps-link")
            })
        );
    }

    console.log(`Embedding content into ${courses.length} listings...`);
    for (const course of courses) {
        const likes = 0;
        const dislikes = 0;
    
        const display = document.createElement("span");
        display.textContent = `(${likes} 👍 ${dislikes} 👎)`;
        display.style.marginLeft = '10px';
        course.element.appendChild(display);
    }
}

const title = document.getElementById("PT_PAGETITLE1lbl");
if (title && title.textContent === "Class Search Results") {
    embed();
    
    // Re-parse whenever user changes filters
    const filters = document.querySelector("table.ps_grid-flex[title=\"Selected Filters\"]");
    const observer = new MutationObserver(embed);

    // Monitor the ancestor because SPIRE deletes the filters element
    observer.observe(filters.parentElement.parentElement.parentElement.parentElement, {
        childList: true,   
        subtree: true,     
        characterData: true, 
        attributes: true
    });
}