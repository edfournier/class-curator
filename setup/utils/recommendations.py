from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from transformers import pipeline
import sqlite3
import json
import requests

app = FastAPI()

# Initialize the HuggingFace pipeline for text similarity (using BERT-like model)
similarity_model = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

url = "http://localhost:8080" # Database File Path
RELATIVE_PATH = '.' # NOTE: Change this 
DB_PATH = f'{RELATIVE_PATH}/server/class_c.db'
SETUP_FOLDER_PATH = f'{RELATIVE_PATH}/setup'
COURSE_PATH = f'{SETUP_FOLDER_PATH}/rmp/courses.json'
RATINGS_PATH = f'{SETUP_FOLDER_PATH}/rmp/ratings.csv'
SETUP_QUERIES_PATH = f'{SETUP_FOLDER_PATH}/queries/setup.json'
MANAGE_CLASSES_QUERIES_PATH = f'{SETUP_FOLDER_PATH}/queries/manage_classes.json'
MANAGE_RATINGS_QUERIES_PATH = f'{SETUP_FOLDER_PATH}/queries/manage_ratings.json'


# Sample payload structure for incoming requests
class RecommendationRequest(BaseModel):
    tags: List[str]


# Compute cosine similarity between input tags and course tags
def recommend_courses(input_tags: List[str], courses: List[Dict]) -> List[str]:
    with open(COURSE_PATH, 'r') as courses_file:
        courses = json.load(courses_file) # [{code, name, subject, description}]
        user = {"major": "Computer Science", "minor": "Mathematics", "year": 2025, "tags": ["Machine Learning", "Artificial Intelligence"]}
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

# Get user data from database
@app.get("/{user_name}")
def get_user_data(user_name):
    user_profile_url = url + "/private/users/{user_name}"
    response = requests.get(user_profile_url)
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print(data)
        return data
    else:
        print(f"Request failed with status code: {response.status_code}")


# Get courses from database
@app.get("/courses")
def get_user_data(user_name):
    course_url = url + "/private/courses"
    response = requests.get(course_url)
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print(data)
        return data
    else:
        print(f"Request failed with status code: {response.status_code}")
