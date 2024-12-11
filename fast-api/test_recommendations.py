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

# Add mock user to database for testing
mock_user_id = 3
mock_user = (mock_user_id, 'jdoe@umass.edu', 'John Doe', 2023, 'Spring', 'Computer Science', 'Mathematics', 'Programming,Software Engineering,Computers')

mock_course_dict = {
    'Introduction to Programming': 'COMPSCI 119',
    "Programming Methodology": 'COMPSCI 220',
    'Software Engineering': 'COMPSCI 320'
}
mock_course_titles = [
    "Introduction to Programming",
    "Programming Methodology",
    'Software Engineering'
]
mock_course_descriptions = [
    'A complete introduction to computer programming using the Python language. Topics include coverage of all the supported data types and program code structures, functions (up through lambda expressions and recursion), reasoning about and debugging existing code, implementation of custom libraries, selection of data structures, and the fundamentals of object-oriented programming. Students will create, debug, and run Python 3 programs that explore each of these topics in turn, from simple loops up through the processing of large data sets, and eventually to the creation of professional-quality libraries to synthesize graphics, audio, and other binary file types.  No prior programming experience expected. Not open to Computer Science majors.'
    'Development of individual skills necessary for designing, implementing, testing and modifying larger programs, including: design strategies and patterns, using functional and object-oriented approaches, testing and program verification, code refactoring, interfacing with libraries.',
    'In this course, students learn and gain practical experience with software engineering principles and techniques. The practical experience centers on a semester-long team project in which a software development project is carried through all the stages of the software life cycle. Topics in this course include requirements analysis, specification, design, abstraction, programming style, testing, maintenance, communication, teamwork, and software project management. Particular emphasis is placed on communication and negotiation skills and on designing and developing maintainable software.  Use of computer required. Several written assignments, in-class presentations, and a term project. This course satisfies the Integrative Experience requirement for BS and BA CS majors.'
]

@pytest.fixture
def client():
    return TestClient(app)

@patch("recommendations.sqlite3.connect")
@patch("recommendations.SentenceTransformer")
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
    with patch("your_module.util.semantic_search") as mock_search:
        mock_search.return_value = [[{"corpus_id": 0}, {"corpus_id": 1}]]

        # Test endpoint
        response = client.get("/recommend/3")

        assert response.status_code == 200
        for course in mock_courses:
            assert course in response.json()["recommended_courses"]
