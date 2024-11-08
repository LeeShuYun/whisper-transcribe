import logging
from .whispertiny import audio_to_text
from ..entities.entity import session, engine, Base, Transcribe, TranscriptionIndex, transcribe_fields

# normally I'd split this into repo and service but this is a small app

logger = logging.getLogger(__name__)

# def getByTranscription(search):
#     ## fetch new transcription
#     query = (
#         session.query(Transcribe.id, Transcribe.created_on, Transcribe.audio_file_name, Transcribe.transcription)
#         .join(TranscriptionIndex, Transcribe.id == TranscriptionIndex.rowid)
#         .filter(TranscriptionIndex.transcription.match(search))
#         # .order_by(TranscriptionIndex.created_on)
#     )
#     search_result = query.all()
#     print("received new search result {}".format(search_result))
#     return search_result

def save(transcribe_record):
    session.add(transcribe_record)
    session.commit()

def transcribeAndSave(filename, file_bytes):
    print("inside the method")
    transcription = audio_to_text(file_bytes)
    logger.info(transcription)
    print("making trabscribe ")
    transcribe_record = Transcribe(filename, transcription)
    print("saving trabscribe ")
    save(transcribe_record)
    return transcription


