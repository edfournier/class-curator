import json
from utils.preprocessing import preprocess_data
from utils.sqlite3_ops import open_db_connection, purge_db

## file paths
RELATIVE_PATH = '.' # NOTE: Change this 
COURSE_PATH = f'{RELATIVE_PATH}/rmp/courses.json'
RATINGS_PATH = f'{RELATIVE_PATH}/rmp/ratings.csv'
DB_PATH = f'{RELATIVE_PATH}/class_c.db'
SETUP_QUERIES_PATH = f'{RELATIVE_PATH}/queries/setup.json'


## --- Read data from sources --- ##
raw_data_ratings = []
raw_data_courses = {}

with open(COURSE_PATH, 'r') as courses_file:
    raw_data_courses = json.load(courses_file) # [{code, name, subject, description}]

with open(RATINGS_PATH, 'r') as ratings_file:
    ratings_file.readline() # skip the header line
    for line in ratings_file:
        raw_data_ratings.append(line.strip().split(',')) # class, difficulty, helpfulness, professor, date


## --- Prepare Data --- ##
data_courses, data_classes = preprocess_data(raw_data_courses, raw_data_ratings)


## --- Reset, Create and Populate Database --- ##
# Purge DB
purge_db(DB_PATH)

# Create DB and Open DB connection
db_connection = open_db_connection(DB_PATH)
cursor = db_connection.cursor()

with open(SETUP_QUERIES_PATH) as queries:
    queries = json.load(queries)

    # Table Creation
    cursor.execute(queries['create_table_user'])
    cursor.execute(queries['create_table_course'])
    cursor.execute(queries['create_table_class'])
    cursor.execute(queries['create_table_rating_aggr'])
    cursor.execute(queries['create_table_rating_user'])
    cursor.execute(queries['create_table_friendship'])
    cursor.execute(queries['create_table_friend_request'])
