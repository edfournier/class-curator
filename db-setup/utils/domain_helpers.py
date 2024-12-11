from typing import Tuple
from datetime import datetime
import re

# Convert abc1234X, abC 1234X, abc  1234X, ab c1234x -> ABC 1234X
def standardize_course_code(code: str) -> str:
    code = code.upper().replace(' ', '').replace('-', '')
    for idx, char in enumerate(code):
        if char.isdigit():
            break
    return ' '.join([code[:idx], code[idx:]])

# Check if course code is of the standard format
def is_valid_course_code(code: str) -> bool:
    return re.match("^[A-Z]+ [0-9][0-9][0-9][A-Z]*$", code) is not None

# Convert dates into equivalent university sessions
def determine_session(date: str) -> Tuple[int, str]:
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    recorded_month = date_obj.month
    recorded_year = date_obj.year

    # Assuming only two semesters (FALL, SPRING), and that students will only rate after the semester is over
    semester = "FALL" if recorded_month > 5 else "SPRING"
    # Observation: (if assumption is true then) Ratings for a Fall semester will be in the following calendar year
    year = recorded_year - 1 if semester == "FALL" else recorded_year
    return year, semester
