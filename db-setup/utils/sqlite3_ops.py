import os
import sqlite3

def purge_db(db_path: str) -> None:
    # NOTE: To purge SQLite DB, delete the file at db_path
    if os.path.exists(db_path):
        os.remove(db_path)

def open_db_connection(db_path: str) -> object:
    return sqlite3.connect(db_path)

# Used to create queries for bulk insert operations ( See ../queries/manage_*.json files for templates)
def construct_query_with_values(query_parts, records):
    values = []
    for record in records:
        values.append(query_parts['template'].format(*record))
    return query_parts['prefix'] + ', '.join(values) + query_parts['postfix']
