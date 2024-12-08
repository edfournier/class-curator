export async function getUserDetails() {
    return Promise.resolve({
        major: "Computer Science",
        minor: "Linguistics",
        year: 2025,
        tags: ["Machine Learning", "Artificial Intelligence", "Networks"]
    });
}

export async function putUserDetails(details) {
    return Promise.resolve();
}

export async function getUserInterests(email) {
    return Promise.resolve([
        { name: "Data Structures", code: "CS 187" },
        { name: "Algorithms", code: "CS 201" },
        { name: "Operating Systems", code: "CS 350" },
        { name: "Machine Learning", code: "CS 500" }
    ]);
}