import axios from "axios";

function createExtensionButton(course) {
    // Button that auto-opens the extension (i.e. redirect)
    const button = document.createElement("button");
    button.textContent = "🔍";
    button.style.marginLeft = "10px";
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        // Tell background script to open popup with this course
        chrome.runtime.sendMessage({ type: "open-popup", course: { code: course.code, name: course.name } });
    });
    return button;
}

function createRatingsDisplay(course) {
    // Create a display for the two spans
    const display = document.createElement("span");
    display.style.display = "inline-flex";
    display.style.alignItems = "center";
    display.style.padding = "4px 10px";
    display.style.backgroundColor = "#4c6ef5";
    display.style.color = "white";
    display.style.borderRadius = "12px";
    display.style.fontSize = "14px";
    display.style.fontWeight = "bold";
    display.style.marginLeft = "10px";
    display.style.cursor = "default";

    const likesSpan = document.createElement("span");
    likesSpan.textContent = `${course.upvotes} 👍`;

    const dislikesSpan = document.createElement("span");
    dislikesSpan.textContent = `${course.downvotes} 👎`;
    dislikesSpan.style.marginLeft = "10px";

    // Append both spans inside the display
    display.appendChild(likesSpan);
    display.appendChild(dislikesSpan);

    return display;
}

async function embed() {
    console.log("Parsing course search results...");
    const courses = [];
    const first = document.getElementById("PTS_RSLTS_LIST$0_row_0"); // First search result
    if (first) {
        const results = first.parentElement;
        results.childNodes.forEach((result) =>
            courses.push({
                // Parse course code, removing excess whitespace
                code: result.querySelector("p[hidden]").textContent.trim().replace(/\s+/g, " "),
                element: result.querySelector(".ps-link")
            })
        );
    }

    try {
        // Fetch upvotes/downvotes for each course
        const query = courses.map((course) => course.code).join(",");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/${query}`);
        const courseDetails = res.data;

        // Merge fetched data with parsed data
        const merged = courses.map((course) => {
            const courseDetail = courseDetails.find((detail) => {
                // Sanitize inputs
                return detail.course.code.replace(/\s+/g, "") === course.code.replace(/\s+/g, "");
            });
            return {
                ...course,
                name: courseDetail ? courseDetail.course.name : "Unknown Course", // It's possible our data isn't fully updated
                upvotes: courseDetail ? courseDetail.upvotes : 0,
                downvotes: courseDetail ? courseDetail.downvotes : 0
            };
        });

        // Render content
        console.log(`Embedding content into ${courses.length} listings...`);
        for (const course of merged) {
            course.element.appendChild(createRatingsDisplay(course));
            course.element.appendChild(createExtensionButton(course));
        }
    } catch (err) {
        console.error(err);
    }
}

const title = document.getElementById("PT_PAGETITLE1lbl");
if (title && title.textContent === "Class Search Results") {
    // Embed and re-embed whenever user changes filters
    embed();
    const filters = document.querySelector('table.ps_grid-flex[title="Selected Filters"]');
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
