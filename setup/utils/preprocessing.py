from typing import List, Tuple

from typing import Tuple
from datetime import datetime
import re

def standardize_course_code(code: str) -> str:
    code = code.upper().replace(' ', '').replace('-', '')
    for idx, char in enumerate(code):
        if char.isdigit():
            break
    return ' '.join([code[:idx], code[idx:]])

# TODO: Revisit this function to ensure that we aren't missing any valid courses
def is_valid_course_code(code: str) -> bool:
    return re.match("^[A-Z]+ [0-9][0-9][0-9][A-Z]*$", code) is not None

# TODO: Revisit this function to tighten assumptions
def determine_session(date: str) -> Tuple[int, str]:
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    recorded_month = date_obj.month
    recorded_year = date_obj.year

    # Assuming only two semesters (FALL, SPRING), and that students will only rate after the semester is over
    semester = "FALL" if recorded_month > 5 else "SPRING"
    # Observation: (if assumption is true then) Ratings for a Fall semester will be in the following calendar year
    year = recorded_year - 1 if semester == "FALL" else recorded_year
    return year, semester

def preprocess_course_data(raw_data_courses: List[object]) -> List[Tuple[str, str, str, str]]:
    data_courses = []
    for record in raw_data_courses:
        # standardizing inputs
        code = standardize_course_code(record['code'])
        name = record['name'].replace('"', "'")
        subject = record['subject'].replace('"', "'")
        description = record['description'].replace('"', "'") if record['description'] else "" # coercing empty descriptions into ""

        data_courses.append((code, name, subject, description))
    return data_courses

def preprocess_class_data(raw_data_ratings: List[List[str]]) -> Tuple[
        List[Tuple[str, int, str, str, float, float]]
    ]:
    data_classes = []
    # Cleaning and Grouping raw data
    class_details = {}
    for record in raw_data_ratings:
        # standardizing inputs
        code = standardize_course_code(record[0]) # Good to have: Convert 'CS' into 'COMPSCI' and similar coercions
        difficulty = int(record[1])
        helpfulness = int(record[2])
        prof = '/'.join(sorted(record[3:-1])).replace('"', "'") # Needed since some classes may have more than one prof, so recording all in alpha order
        rating_datestr = record[-1] # Last item will always be the rating datestring, even if some classes may have more than one prof
        
        # Need to ignore records from which information cannot be recovered
        if not is_valid_course_code(code):
            continue

        year, semester = determine_session(rating_datestr)
        class_identifier = (code, year, semester)

        if class_identifier not in class_details:
            class_details[class_identifier] = {
                "rate_difficulty": difficulty,
                "rate_helpfulness": helpfulness,
                "count": 1,
                "profs": [prof]
            }
        else:
            class_details[class_identifier]["rate_difficulty"] += difficulty
            class_details[class_identifier]["rate_helpfulness"] += helpfulness
            class_details[class_identifier]["count"] += 1
            class_details[class_identifier]["profs"].append(prof) # Good to have: Handle misspelled profs, which results in false entries

    for class_identifier in class_details:
        # generating aggregates
        count = class_details[class_identifier]["count"]
        class_details[class_identifier]["rate_difficulty"] = round(class_details[class_identifier]["rate_difficulty"]/count, 3)
        class_details[class_identifier]["rate_helpfulness"] = round(class_details[class_identifier]["rate_helpfulness"]/count, 3)

        # NOTE: assuming most frequently named prof will be correct
        found_profs_list = class_details[class_identifier]["profs"]
        class_details[class_identifier]["prof"] = max(set(found_profs_list), key=found_profs_list.count)

        data_classes.append((
            *class_identifier, 
            class_details[class_identifier]["prof"], 
            class_details[class_identifier]["rate_difficulty"], 
            class_details[class_identifier]["rate_helpfulness"]
        ))
    
    return data_classes
