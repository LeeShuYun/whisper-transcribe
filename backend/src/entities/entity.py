from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_restful import fields
import sqlalchemy

print ("sqlalchemy version:",sqlalchemy.__version__)

Base = declarative_base()

class Transcribe(Base):
    """
    Row mapping object for 'transcription' table

    Attributes:
    created_on (str): Timestamp of when transcription is created. Primary key.
    audio_file_name (str): Name of the audio file processed.
    transcription (str): Text transcription of the audio file.
    """

    __tablename__ = 'transcriptions'
    id = Column(Integer, primary_key=True)
    created_on = Column(String)
    audio_file_name = Column(String)
    transcription = Column(String)

    def __init__(self, id: int , created_on: str, audio_file_name: str, transcription: str):
        """Initialize new object with all params. time in utc"""
        self.id = id
        self.created_on = datetime.now(timezone.utc)
        self.audio_file_name = audio_file_name
        self.transcription = transcription

    def __repr__(self) -> str:
        """
        Return string representation of this instance.

        Returns:
        str: Formatted string showing the created timestamp, audio filename and transcription.
        """
        print(f"{self.audio_file_name}")
        return f"<Transcription(created_on='{self.created_on}', audio_file_name='{self.audio_file_name}', transcription='{self.transcription}')>"


class TranscriptionIndex(Base):
    """
    Row mapping object for 'transcription' table

    Attributes:
    created_on (str): Timestamp of when transcription is created. Primary key.
    audio_file_name (str): Name of the audio file processed.
    transcription (str): Text transcription of the audio file.
    """
    __tablename__ = 'transcriptions_idx'

    rowid = Column(Integer, primary_key=True)
    rank = Column(String)
    created_on = Column(String)
    audio_file_name = Column(String)
    transcription = Column(String)

# initialise ORM and create session for SQLite db
# engine = create_engine('sqlite:///:memory:', echo=False)
engine = create_engine('sqlite:///src/data/transcribe.db')
Session = sessionmaker(bind=engine)
session = Session()

# mapping fields for Flask RESTful auto serialisation
transcribe_fields = {
    'id': fields.Integer,
    'created_on': fields.String,
    'audio_file_name': fields.String,
    'transcription': fields.String
}
