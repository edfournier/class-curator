from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from sentence_transformers import SentenceTransformer, util
import sqlite3
import json


app = FastAPI()

# Open connection to database
con = sqlite3.connect('../server/class_c.db')
cursor = con.cursor()

# Initialize the model for sentence embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Sample payload structure for incoming requests
class RecommendationRequest(BaseModel):
    tags: List[str]

# Load course data
query = "SELECT * from COURSE;"
courses = cursor.execute(query).fetchall()
print(courses[0])

# Function to recommend courses based on semantic search
def recommend_courses(input_tags: List[str], courses: List[Dict]) -> List[str]:
    input_text = " ".join(input_tags)
    input_embedding = model.encode(input_text, convert_to_tensor=True)

    # Prepare course titles and descriptions, handling null descriptions
    course_titles = [course[3] for course in courses]
    course_descriptions = [course[4] if course[4] else "" for course in courses]

    # Encode course descriptions
    course_embeddings = model.encode(course_descriptions, convert_to_tensor=True)

    # Perform semantic search
    hits = util.semantic_search(input_embedding, course_embeddings, top_k=5)[0]

    recommendations = [course_titles[hit['corpus_id']] for hit in hits]

    return recommendations

@app.post("/recommend")
def get_recommendations(request: RecommendationRequest):
    recommendations = recommend_courses(request.tags, courses)
    return {"recommended_courses": recommendations}

# Example usage
if __name__ == "__main__":
    user = {"tags": ["Machine Learning", "Artificial Intelligence"]}
    print(recommend_courses(user["tags"], courses))