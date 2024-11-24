function createExtensionButton(course) {
    const button = document.createElement("button");
    button.textContent = "🧩";
    button.style.marginLeft = "10px";
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        // Send message to background script to open popup
        chrome.runtime.sendMessage({ type: "popup", course: course.title });
    });
    return button;
}

function createRatingsDisplay(course) {
    // TODO: hit API to get course likes/dislikes
    const likes = 0;
    const dislikes = 0;

    const display = document.createElement("span");
    display.textContent = `(${likes} 👍 ${dislikes} 👎)`;
    display.style.marginLeft = "10px";
    return display;
}

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
        course.element.appendChild(createRatingsDisplay(course));
        course.element.appendChild(createExtensionButton(course));
    }
}

const title = document.getElementById("PT_PAGETITLE1lbl");
if (title && title.textContent === "Class Search Results") {
    embed();
    
    // Re-parse whenever user changes filters
    const filters = document.querySelector("table.ps_grid-flex[title=\"Selected Filters\"]");
    const observer = new MutationObserver(embed);

    // Monitor the ancestor because SPIRE deletes the filters element
    // Unholy chaining is required because element IDs change per session
    observer.observe(filters.parentElement.parentElement.parentElement.parentElement, {
        childList: true,   
        subtree: true,     
        characterData: true, 
        attributes: true
    });
}