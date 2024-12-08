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

export async function getCourseInsights(id) {
    return Promise.resolve({
        prof: "Cameron Musco", // Recommended professor

        // Historical data
        data: [
            { semester: "FALL", year: 2019, helpfulness: 1.2, difficulty: 2.2 },
            { semester: "FALL", year: 2017, helpfulness: 4.8, difficulty: 4.6 },
            { semester: "SPRING", year: 2023, helpfulness: 1.1, difficulty: 3.4 },
            { semester: "SPRING", year: 2018, helpfulness: 3.5, difficulty: 2.9 },
            { semester: "SPRING", year: 2016, helpfulness: 2.2, difficulty: 4.8 },
            { semester: "SPRING", year: 2021, helpfulness: 2.6, difficulty: 0.2 },
            { semester: "FALL", year: 2016, helpfulness: 2.8, difficulty: 2.6 },
            { semester: "FALL", year: 2022, helpfulness: 4.6, difficulty: 2.1 },
        ]
    });
}

export async function postCourseRating(id, type) {
    return Promise.resolve();
}

export async function postCourseInterest(id, isInterested) {
    return Promise.resolve();
}