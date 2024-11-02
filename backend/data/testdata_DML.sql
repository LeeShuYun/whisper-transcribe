SELECT 1;

-- timestamp in UTC
INSERT INTO transcription (created_on, audio_file_name, transcription)
VALUES ((datetime('now')), "Sample 000", "This is a placeholder");
