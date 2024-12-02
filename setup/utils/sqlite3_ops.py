import os
import sqlite3

def purge_db(db_path: str) -> None:
    # NOTE: To purge SQLite DB, delete the file at db_path
    if os.path.exists(db_path):
        os.remove(db_path)

def open_db_connection(db_path: str) -> object:
    return sqlite3.connect(db_path)
