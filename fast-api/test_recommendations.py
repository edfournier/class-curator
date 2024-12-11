import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from recommendations import app, get_recommendations

# Mock data for courses
mock_courses = [
    (3546, 'COMPSCI 119', 'Introduction to Programming', 'Computer Science', 'A complete introduction to computer programming using the Python language. Topics include coverage of all the supported data types and program code structures, functions (up through lambda expressions and recursion), reasoning about and debugging existing code, implementation of custom libraries, selection of data structures, and the fundamentals of object-oriented programming. Students will create, debug, and run Python 3 programs that explore each of these topics in turn, from simple loops up through the processing of large data sets, and eventually to the creation of professional-quality libraries to synthesize graphics, audio, and other binary file types.  No prior programming experience expected. Not open to Computer Science majors.'),
    (3566, 'COMPSCI 220', 'Programming Methodology', 'Computer Science', 'Development of individual skills necessary for designing, implementing, testing and modifying larger programs, including: design strategies and patterns, using functional and object-oriented approaches, testing and program verification, code refactoring, interfacing with libraries.'),
    (3576, 'COMPSCI 320', 'Software Engineering', 'Computer Science', 'In this course, students learn and gain practical experience with software engineering principles and techniques. The practical experience centers on a semester-long team project in which a software development project is carried through all the stages of the software life cycle. Topics in this course include requirements analysis, specification, design, abstraction, programming style, testing, maintenance, communication, teamwork, and software project management. Particular emphasis is placed on communication and negotiation skills and on designing and developing maintainable software.  Use of computer required. Several written assignments, in-class presentations, and a term project. This course satisfies the Integrative Experience requirement for BS and BA CS majors.')
]

# Add mock user to database for testing using the follow script:

# import sqlite3
# conn = sqlite3.connect("./server/class_c.db")
# cursor = conn.cursor()
# addQuery =  """
#             INSERT INTO USER
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
#             """
# mock_user = (10, 'jdoe@umass.edu', 'John Doe', 2023, 'Spring', 'Computer Science', 'Mathematics', 'Programming,Software Engineering,Computers')
# cursor.execute(addQuery, mock_user)


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

    # Test endpoint
    response = client.get("/recommend/3")

    assert response.status_code == 200
    for course in mock_courses:
        assert type(course) is str
