import sqlite3

connection = sqlite3.connect('transcribe.db')
connection.row_factory = sqlite3.Row
# def get_db_connection():
#     conn = sqlite3.connect('data/transcribe.db')
#     conn.row_factory = sqlite3.Row
#     return conn

with open('schema_DDL.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

# cur.execute("INSERT INTO transcription (created_on, audio_file_name, transcription) VALUES (?, ?, ?)",
#             ("2024-11-02 14:31:59:1730557919", "Sample 00", "This is a placeholder")
#             )

# cur.execute("INSERT INTO transcription (created_on, audio_file_name, transcription) VALUES (?, ?, ?)",
#             ("2024-11-02 14:31:59:1730557920", "Sample 000", "This is also a placeholder")
#             )

connection.commit()
connection.close()
