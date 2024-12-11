import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from recommendations import app, get_recommendations

# Mock user for testing
mock_user = (3, 'jdoe@umass.edu', 'John Doe', 2023, 'Spring', 'Computer Science', 'Mathematics', 'Programming,Software Engineering,Computers')

# Add mock user to database for testing using the follow script:
# import sqlite3
# conn = sqlite3.connect("./server/class_c.db")
# cursor = conn.cursor()
# addQuery =  """
#             INSERT INTO USER
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
#             """
# mock_user = (3, 'jdoe@umass.edu', 'John Doe', 2023, 'Spring', 'Computer Science', 'Mathematics', 'Programming,Software Engineering,Computers')
# cursor.execute(addQuery, mock_user)
# conn.commit()
# conn.quit()
# quit()


# Test Client for FastAPI
@pytest.fixture
def client():
    return TestClient(app)

@patch("recommendations.sqlite3.connect")
def test_get_recommendations(mock_sqlite, client):
    # Mock database connection
    mock_connection = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.execute.return_value.fetchall.side_effect = mock_user
    mock_connection.cursor.return_value = mock_cursor
    mock_sqlite.return_value = mock_connection

    # Call endpoint using Test Client
    response = client.get("/recommend/3")

    # Test for HTTP request response
    assert response.status_code == 200

    # Test for course format
    for course in response.json()["recommended_courses"]:
        assert type(course) is str
        course_code = course.partition(' ')[2][:3]
        assert course_code.isnumeric()
