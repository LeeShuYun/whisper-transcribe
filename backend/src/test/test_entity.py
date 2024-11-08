#!/usr/bin/env python3
import unittest
from datetime import datetime, timezone
from ..entities.entity import Transcribe

class TestTranscription(unittest.TestCase):
    def test_transcribe_init(self):
        """
        GIVEN a Transcribe entity
        WHEN a new Transcribe is created
        THEN Checks the audio_file_name, transcription are defined correctly
        """
        transcribe = Transcribe("Sample 1.mp3", "My name is Shuyun. I was asked to finish this by 6. Now it is already 12 p.m. I need to hurry up.")
        self.assertEqual(transcribe.audio_file_name, "Sample 1.mp3")
        self.assertEqual(transcribe.transcription, "My name is Shuyun. I was asked to finish this by 6. Now it is already 12 p.m. I need to hurry up.")


if __name__ == '__main__':
    unittest.main()
