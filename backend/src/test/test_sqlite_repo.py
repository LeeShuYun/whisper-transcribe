#!/usr/bin/env python3
import unittest
import logging
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone
from ..entities.entity import Transcribe
from ..entities.entity import session, engine, Base, Transcribe, TranscriptionIndex, transcribe_fields
from ..services.sqlite_repo import transcribeAndSave
from ..services.whispertiny import audio_to_text
import numpy as np

class TestTranscribeAndSave(unittest.TestCase):
    mock_transcription = "transcribe placeholder askjdflasdjlf"

    def audio_to_text(arg):
        return mock_transcription

    @patch('src.services.whispertiny.audio_to_text')
    @patch('src.entities.entity.Transcribe')
    @patch('src.entities.entity.session.add')
    @patch('src.entities.entity.session.commit')
    def test_transcribeAndSave_success(self, mock_commit, mock_add, mock_Transcribe, mock_audio_to_text):
        # src.services.whispertiny.audio_to_text()
        # module.ClassName2()
        # assert MockClass1 is module.ClassName1
        # assert MockClass2 is module.ClassName2
        # assert MockClass1.called
        # assert MockClass2.called

        # Setup mock objects
        mockfile = MagicMock()
        mockfile.read.return_value = b"audio_data"
        mockfile.name = "Sample 1.mp3"

        mock_file = np.array([1, 2, 3])

        audio_to_text = MagicMock()
        audio_to_text.return_value = "transcribe placeholder askjdflasdjlf"

        mock_Transcribe = MagicMock()
        mock_Transcribe.id = 1
        mock_Transcribe.created_on = "2024-11-8"
        mock_Transcribe.audio_file_name = "Sample 1.mp3"
        mock_Transcribe.transcription = "transcribe placeholder askjdflasdjlf"

        mock_transcribe_instance = MagicMock()
        mock_Transcribe.return_value = mock_transcribe_instance

        # trigger method
        result = transcribeAndSave("Sample 1.mp3", mock_file)

        # assertions
        mock_audio_to_text.assert_called_once_with(b"audio_data")
        mock_Transcribe.assert_called_once_with(filename="Sample 1.mp3", transcription="transcribe placeholder askjdflasdjlf")
        mock_add.assert_called_once_with(mock_transcribe_instance)
        mock_commit.assert_called_once()
        self.assertEqual(result, "Transcribed Text")

    def transcribeAndSave_failure(self):
        mock = Mock(side_effect=KeyError('foo'))
        mock()



if __name__ == '__main__':
    unittest.main()
