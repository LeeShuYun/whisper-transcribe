-- SQLite
DROP TABLE IF EXISTS transcriptions;
DROP TABLE IF EXISTS transcriptions_idx;
CREATE TABLE IF NOT EXISTS transcriptions
(
	id INTEGER NOT NULL PRIMARY KEY,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	audio_file_name TEXT NOT NULL,
	transcription TEXT
);

-- for full text search.
CREATE VIRTUAL TABLE transcriptions_idx USING fts5
(
	created_on,
	audio_file_name,
	transcription,
	content= 'transcriptions',
	content_rowid = 'id'
);
-- Triggers to keep the FTS index up to date.
CREATE TRIGGER transcribe_insert AFTER INSERT ON transcriptions BEGIN
  INSERT INTO transcriptions_idx(rowid, created_on, audio_file_name, transcription)
 VALUES (new.id, new.created_on, new.audio_file_name, new.transcription);
END;

CREATE TRIGGER transcribe_delete AFTER DELETE ON transcriptions BEGIN
  INSERT INTO transcriptions_idx(rowid, created_on, audio_file_name, transcription)
 VALUES('delete', OLD.created_on, old.audio_file_name, old.transcription);
END;
CREATE TRIGGER transcribe_update AFTER UPDATE ON transcriptions BEGIN
  INSERT INTO transcriptions_idx(rowid, created_on, audio_file_name, transcription)
 VALUES('delete', old.created_on, old.audio_file_name, old.transcription);
  INSERT INTO transcriptions_idx(rowid, created_on, audio_file_name, transcription)
 VALUES (new.created_on, new.created_on, new.audio_file_name, new.transcription);
END;

--insert test data
INSERT INTO transcriptions (created_on, audio_file_name, transcription)
VALUES ((strftime('%Y-%m-%d %H:%M:%S:%s')), "Sample 0", "This is a placeholder");

INSERT INTO transcriptions (created_on, audio_file_name, transcription)
VALUES (strftime('%Y-%m-%d %H:%M:%S:%s'), "Sample 000", "This is a placeholder");

INSERT INTO transcriptions (created_on, audio_file_name, transcription)
VALUES (strftime('%Y-%m-%d %H:%M:%S:%s'), "SampleTEST", "This is a placeholder");

-- select * from transcriptions

-- select * from transcriptions_idx

-- SELECT * FROM transcriptions_idx
-- WHERE transcriptions_idx MATCH 'sample NOT 000' ORDER BY rank;

SELECT rank, t.created_on, t.audio_file_name, t.transcription FROM transcriptions t
JOIN transcriptions_idx i ON t.ROWID = i.ROWID
WHERE transcriptions_idx MATCH "sample" ORDER BY rank;
