-- timestamp in UTC
INSERT INTO transcription (created_on, audio_file_name, transcription)
VALUES (strftime('%Y-%m-%d %H:%M:%S:%s'), "Sample 0", "This is a placeholder");

INSERT INTO transcription (created_on, audio_file_name, transcription)
VALUES (strftime('%Y-%m-%d %H:%M:%S:%s'), "Sample 00", "This is a placeholder");

INSERT INTO transcription (created_on, audio_file_name, transcription)
VALUES (strftime('%Y-%m-%d %H:%M:%S:%s'), "Sample 000", "This is a placeholder");

select * from transcription

SELECT * FROM transcription_fts WHERE transcription_fts MATCH 'Sample 000';

