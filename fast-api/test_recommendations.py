import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import sqlite3
from sentence_transformers import SentenceTransformer, util
from recommendations import app, recommend_courses

# Mock data for courses
mock_courses = [
    (3546, 'COMPSCI 119', 'Introduction to Programming', 'Computer Science', 'A complete introduction to computer programming using the Python language. Topics include coverage of all the supported data types and program code structures, functions (up through lambda expressions and recursion), reasoning about and debugging existing code, implementation of custom libraries, selection of data structures, and the fundamentals of object-oriented programming. Students will create, debug, and run Python 3 programs that explore each of these topics in turn, from simple loops up through the processing of large data sets, and eventually to the creation of professional-quality libraries to synthesize graphics, audio, and other binary file types.  No prior programming experience expected. Not open to Computer Science majors.'),
    (3566, 'COMPSCI 220', 'Programming Methodology', 'Computer Science', 'Development of individual skills necessary for designing, implementing, testing and modifying larger programs, including: design strategies and patterns, using functional and object-oriented approaches, testing and program verification, code refactoring, interfacing with libraries.'),
    (3648, 'COMPSCI 520', 'Theory and Practice of Software Engineering', 'Computer Science', 'Introduces students to the principal activities and state-of-the-art techniques involved in developing high-quality software systems. Topics include: requirements engineering, formal specification methods, design principles & patterns, verification & validation, debugging, and automated software engineering.')
]

mock_user = (1, "John Doe", "jdoe@umass.edu", "Machine Learning,Artificial Intelligence")

mock_course_dict = {
    'Introduction to Programming': 'COMPSCI 119',
    "Programming Methodology": 'COMPSCI 220',
    "Theory and Practice of Software Engineering": 'COMPSCI 520'
}
mock_course_titles = [
    "Introduction to Programming",
    "Programming Methodology",
    "Theory and Practice of Software Engineering"
]
mock_course_descriptions = [
    'A complete introduction to computer programming using the Python language. Topics include coverage of all the supported data types and program code structures, functions (up through lambda expressions and recursion), reasoning about and debugging existing code, implementation of custom libraries, selection of data structures, and the fundamentals of object-oriented programming. Students will create, debug, and run Python 3 programs that explore each of these topics in turn, from simple loops up through the processing of large data sets, and eventually to the creation of professional-quality libraries to synthesize graphics, audio, and other binary file types.  No prior programming experience expected. Not open to Computer Science majors.'
    'Development of individual skills necessary for designing, implementing, testing and modifying larger programs, including: design strategies and patterns, using functional and object-oriented approaches, testing and program verification, code refactoring, interfacing with libraries.',
    'Introduces students to the principal activities and state-of-the-art techniques involved in developing high-quality software systems. Topics include: requirements engineering, formal specification methods, design principles & patterns, verification & validation, debugging, and automated software engineering.'
]
@pytest.fixture
def client():
    return TestClient(app)

@patch("sqlite3.connect")
@patch("SentenceTransformer")
def test_get_recommendations(mock_transformer, mock_sqlite, client):
    # Mock database connection
    mock_connection = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.execute.return_value.fetchall.side_effect = [mock_courses, [mock_user]]
    mock_connection.cursor.return_value = mock_cursor
    mock_sqlite.return_value = mock_connection

    # Mock SentenceTransformer
    mock_model = MagicMock()
    mock_model.encode.side_effect = lambda x, convert_to_tensor: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
        [0.7, 0.8, 0.9],
    ]
    mock_transformer.return_value = mock_model

    # Mock util.semantic_search
    with patch("recommendations.util.semantic_search") as mock_search:
        mock_search.return_value = [[{"corpus_id": 0}, {"corpus_id": 1}]]

        # Test endpoint
        response = client.get("/recommend/1")

        assert response.status_code == 200
        assert response.json() == {"recommended_courses": ["COMPSCI 119", "COMPSCI 220"]}

@patch("recommendations.SentenceTransformer")
def test_recommend_courses(mock_transformer):
    # Mock SentenceTransformer
    mock_model = MagicMock()
    mock_model.encode.side_effect = lambda x, convert_to_tensor: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
    ]
    mock_transformer.return_value = mock_model

    with patch("recommendations.util.semantic_search") as mock_search:
        mock_search.return_value = [[{"corpus_id": 0}, {"corpus_id": 1}]]

        recommendations = recommend_courses(["Machine Learning", "Artificial Intelligence"], mock_courses)

        assert recommendations == ["COMPSCI 119", "COMPSCI 220"]
