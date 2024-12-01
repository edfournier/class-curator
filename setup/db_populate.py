import json
import sqlite3
import os
import re

from typing import Tuple
from datetime import datetime

def standardize_course_code(code: str) -> str:
    code = code.upper().replace(' ', '').replace('-', '')
    for idx, char in enumerate(code):
        if char.isdigit():
            break
    return ' '.join([code[:idx], code[idx:]])

# TODO: Revisit this function to ensure that we aren't missing any valid courses
def is_valid_course_code(code: str) -> bool:
    return re.match("^[A-Z]+[0-9][0-9][0-9][A-Z]*$", code) is not None

# TODO: Revisit this function.
def determine_session(date: str) -> Tuple[int, str]:
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    recorded_month = date_obj.month
    recorded_year = date_obj.year

    # We're assuming only two semesters (FALL, SPRING), and that students will rate after the semester is over.
    semester = "FALL" if recorded_month > 5 else "SPRING"
    # Ratings made for a Fall semester will be for the previous calendar year
    year = recorded_year - 1 if semester == "FALL" else recorded_year
    return year, semester


## --- Read data from sources --- ##
raw_data_ratings = []
raw_data_courses = {}

with open('../rmp/ratings.csv', 'r') as ratings_file:
    ratings_file.readline() # skip the header line
    for line in ratings_file:
        raw_data_ratings.append(line.strip().split(',')) # class, difficulty, helpfulness, professor, date

with open('../rmp/courses.json', 'r') as courses_file:
    raw_data_courses = json.load(courses_file) # [{code, name, subject, description}]


## --- Pre Processing Data --- ##
class_details = {}
class_prof_map = {}

for record in raw_data_ratings:
    code = record[0]
    difficulty = record[1]
    helpfulness = record[2]
    date = record[-1] # Needed since some records may have more than one prof, but last item will always be date

    # Needed since some records may have more than one prof
    prof = record[3]
    if len(record) > 5:
        for add_prof in sorted(record[4:-1]):
            prof = prof + '/' + add_prof

    # standardizing inputs
    code = standardize_course_code(code)
    
    # Need to ignore records from which information cannot be recovered
    if not is_valid_course_code(code):
        continue

    year, semester = determine_session(date)
    class_identifier = (code, year, semester)

    if class_identifier not in class_details:
        class_details[class_identifier] = {
            "rate_difficulty": difficulty,
            "rate_helpfulness": helpfulness,
            "count": 1,
            "profs": [prof]
        }
    else:
        class_details[class_identifier]["rate_difficulty"] = class_details[class_identifier]["rate_difficulty"] + difficulty
        class_details[class_identifier]["rate_helpfulness"] = class_details[class_identifier]["rate_helpfulness"] + helpfulness
        class_details[class_identifier]["count"] = class_details[class_identifier]["count"] + 1

        if prof not in class_details[class_identifier]["profs"]:
            class_details[class_identifier]["profs"].append(prof)


for class_identifier in class_details:
    # Getting mean RMP ratings 
    count = class_details[class_identifier]["count"]
    class_details[class_identifier]["rate_difficulty"] = class_details[class_identifier]["rate_difficulty"]/count
    class_details[class_identifier]["rate_helpfulness"] = class_details[class_identifier]["rate_helpfulness"]/count


data_courses = []
# Corroborate data and remove false entries
for code, name, subject, description in raw_data_courses:
    code = standardize_course_code(code)
    data_courses.append((code, name, subject, description))

data_classes = []
for code, year, semester in class_details:
    # TODO: Handle multiple profs, mispelled profs
    data_classes.append((code, year, semester, class_details[(code, year, semester)]["profs"][0]))


## --- Reset, Create and Populate Database --- ##
DB_PATH = '../class_c.db'

# Reset DB
if os.path.exists(DB_PATH):
    # NOTE: To reset SQLite DB, delete the file at DB_PATH.
    os.remove(DB_PATH)

# Create DB and Open DB connection
dbConnection = sqlite3.connect(DB_PATH)

with open('queries.json') as queries:
    cursor = dbConnection.cursor()
    queries = json.load(queries)

    # Table Creation
    cursor.execute(queries['create_table_user'])
    cursor.execute(queries['create_table_course'])
    cursor.execute(queries['create_table_class'])
    cursor.execute(queries['create_table_rating_aggr'])
    cursor.execute(queries['create_table_rating_user'])
    cursor.execute(queries['create_table_friendship'])
    cursor.execute(queries['create_table_friend_request'])

"""
    # Data Population
    cursor.execute(queries['populate_table_course'])
"""