function parseCourses() {
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
    console.log(courses);
}

const title = document.getElementById("PT_PAGETITLE1lbl");
if (title && title.textContent === "Class Search Results") {
    parseCourses();
    
    // Re-parse whenever filters change
    const filtersContainer = document.querySelector("#win48divPTS_BREADCRUMB_\\$0")
    const observer = new MutationObserver(() => parseCourses());
    observer.observe(filtersContainer, {
        childList: true,   
        subtree: true,     
        characterData: true, 
        attributes: true
    });
}