import sqlite3

DB_NAME = "voxguard.db"


def get_connection():

    conn = sqlite3.connect(DB_NAME)

    conn.row_factory = sqlite3.Row

    return conn


def initialize_database():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audio_threats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            filename TEXT,

            prediction TEXT,

            confidence REAL,

            variance REAL,

            risk_level TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()

    conn.close()