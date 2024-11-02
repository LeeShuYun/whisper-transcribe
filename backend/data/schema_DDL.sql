-- SQLite
CREATE TABLE IF NOT EXISTS transcription
(
	created_on TEXT NOT NULL UNIQUE PRIMARY KEY,
	audio_file_name TEXT NOT NULL,
	transcription TEXT
);



