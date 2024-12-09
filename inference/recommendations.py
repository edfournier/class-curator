from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from transformers import pipeline
import requests
import json

app = FastAPI()

# Initialize the HuggingFace pipeline for text similarity
similarity_model = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

# Paths
url = "http://localhost:8080"  # Base URL for user and course data
RELATIVE_PATH = '.'  # Update this path as needed
COURSE_PATH = f'{RELATIVE_PATH}/setup/rmp/courses.json'

# Compute cosine similarity between input tags and course tags
def recommend_courses(input_tags: List[str]) -> List[str]:
    with open(COURSE_PATH, 'r') as courses_file:
        courses = json.load(courses_file)  # [{code, name, subject, description, tags}]
        
        input_embedding = similarity_model(" ".join(input_tags))[0]
        recommendations = []

        for course in courses:
            course_tags = course["tags"].split(", ")
            course_embedding = similarity_model(" ".join(course_tags))[0]

            # Calculate cosine similarity
            cosine_similarity = sum(a * b for a, b in zip(input_embedding, course_embedding))
            
            if cosine_similarity > 0.7:  # Threshold for recommendation
                recommendations.append(course["title"])

        return recommendations

# Endpoint to get course recommendations based on user ID
@app.get("/recommendations/{user_id}")
def get_course_recommendations(user_id: str):
    # Fetch user data
    user_profile_url = f"{url}/private/users/{user_id}"
    response = requests.get(user_profile_url)
    
    if response.status_code == 200:
        user_data = response.json()
        
        # Assuming the user's tags are stored as a comma-separated string
        user_tags_str = user_data.get("tags", "")
        
        if not user_tags_str:
            raise HTTPException(status_code=400, detail="No tags found for the user.")
        
        user_tags = [tag.strip() for tag in user_tags_str.split(",")]
        
        # Get course recommendations
        recommendations = recommend_courses(user_tags)
        
        return {"user_id": user_id, "recommended_courses": recommendations}
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch user data")
