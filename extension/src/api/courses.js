export async function getCourseResults(query) {
    return Promise.resolve([
        { name: "Data Structures", code: "CS121", id: 1 },
        { name: "Basic Math", code: "MATH101", id: 2 }
    ]);
}

export async function getCourseDetails(id) {
    return Promise.resolve({
        id: 1,
        name: "Data Structures",
        code: "CS121",
        likes: 10,
        dislikes: 0,
        description: "Learn about data organization, algorithms, and efficiency."
    });
}

export async function postCourseRating(isLike) {
    return Promise.resolve();
}