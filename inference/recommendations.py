from fastapi import FastAPI
from typing import List, Dict
from sentence_transformers import SentenceTransformer, util
import sqlite3

app = FastAPI()

# Open connection to database
con = sqlite3.connect('../server/class_c.db', check_same_thread=False)
cursor = con.cursor()

# Initialize the model for sentence embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load course data
query = "SELECT * from COURSE;"
courses = cursor.execute(query).fetchall()
course_dict = {course[2]: course[1] for course in courses}

# Prepare course titles and descriptions, handling null descriptions
course_titles = [course[2] for course in courses]
course_descriptions = [course[4] if course[4] else "" for course in courses]

# Encode course descriptions
course_embeddings = model.encode(course_descriptions, convert_to_tensor=True)

# Function to recommend courses based on semantic search
def recommend_courses(input_tags: List[str], courses: List[Dict]) -> List[str]:
    input_text = " ".join(input_tags)
    input_embedding = model.encode(input_text, convert_to_tensor=True)

    # Perform semantic search
    hits = util.semantic_search(input_embedding, course_embeddings, top_k=10)[0]

    recommendations = [course_titles[hit['corpus_id']] for hit in hits]

    recommendations = list(set(recommendations))

    return [course_dict[recommendation] for recommendation in recommendations][:5]

@app.get("/recommend/{user_id}")
async def get_recommendations(user_id):
    query = f"SELECT * FROM USER WHERE ID = {user_id};"
    user = cursor.execute(query).fetchone()
    tags = user[7].split(",")
    print(tags)
    recommendations = recommend_courses(tags, courses)
    print(recommendations)
    return {"recommended_courses": recommendations}

if __name__ == "__main__":
    user = {"tags": ["Machine Learning", "Artificial Intelligence"]}
    print(recommend_courses(user["tags"], courses))