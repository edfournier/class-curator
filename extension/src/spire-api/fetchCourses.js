import courses from "../../../rmp/courses.json";

export function fetchCourses() {
    return courses;
    // return fetch("/extension/courses.json")
    // .then((res) => {
    //     if (!res.ok) {
    //         throw new Error(`HTTP error! Status: ${res.status}`);
    //     }
    //     return res.json();
    // })
    // .then((data) =>
    //     console.log(data))
    // .catch((error) =>
    //     console.error("Unable to fetch data:", error));
}