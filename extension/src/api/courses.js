// NOTE: loading with mock data right now
// TODO: other possible ones are add/remove like/dislike/interest, get friends also interested in course

export async function fetchCourseResults(query) {
    return Promise.resolve([
        { name: "Data Structures", code: "CS121", id: 1 },
        { name: "Basic Math", code: "MATH101", id: 2 }
    ]);
}

export async function fetchCourse(id) {
    return Promise.resolve([
        {
            id: 1,
            name: "Data Structures",
            code: "CS121",
            likes: 10,
            dislikes: 0,
            description: "Learn about data organization, algorithms, and efficiency.",
        },
        {
            id: 2,
            name: "Basic Math",
            code: "MATH101",
            likes: 5,
            dislikes: 1,
            description: "A fundamental course covering arithmetic and basic algebra.",
        }
    ]);
}