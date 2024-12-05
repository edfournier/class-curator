// NOTE: loading with mock data right now
// TODO: other possible ones are add/remove like/dislike/interest, get friends also interested in course

export async function fetchCourseResults(query) {
    return Promise.resolve([
        { name: "Data Structures", code: "CS121", id: 1 },
        { name: "Basic Math", code: "MATH101", id: 2 }
    ]);
}

export async function fetchCourse(id) {
    return Promise.resolve(
        {
            id: 1,
            name: "Data Structures",
            code: "CS121",
            likes: 10,
            dislikes: 0,
            description: "Learn about data organization, algorithms, and efficiency.",
        }
    );
}