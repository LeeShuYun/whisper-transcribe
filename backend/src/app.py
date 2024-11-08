from flask import Flask, jsonify, request, abort
from flask_restful import Api, Resource, fields, marshal_with, request
from flask_cors import CORS
from sqlalchemy import select, insert
from sqlalchemy.sql import text
import logging
import json
import os

from .entities.entity import Session, engine, Base, Transcribe, TranscriptionIndex, transcribe_fields
from .services.whispertiny import audio_to_text
from .services.sqlite_repo import transcribeAndSave
from .config.config import DevelopmentConfig
from .config.constants import links

print("In module products __package__, __name__ ==", __package__, __name__)

Base.metadata.create_all(engine)
session = Session()

app = Flask(__name__)
CORS(app)
api = Api(app)

logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """ Returns details about service according to HATEOAS"""
    data = {
        "version": "1.0",
        "links": links
    }
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*') #TODO should restrict for prod
    return response

# GET /health: Returns the status of the service. TODO
class get_health(Resource):
    def get(self):
        logger.info("Accessing /health... ")
        data={
            "status": "UP",
            "links": links
        }
        response = jsonify(data)
        response.headers.add('Access-Control-Allow-Origin', '*') #TODO should restrict
        return response
api.add_resource(get_health,'/health')


# ii. POST /transcribe: Accepts audio files, transcribe and save results in db.
class post_transcribe(Resource):
    def post(self):
        logger.info("Accessing /transcribe... ")
        try:
            # extract file from request body and validate
            logger.debug("Try: get data from request... ")
            file = request.files['audiofile']
            logger.debug("file obtained>> ".format(file))
            if not file:
                abort(400, description='Empty file.')
            filename = request.files['audiofile'].filename
            if not filename.lower().endswith(('.mp3')):
                abort(400, description='Wrong file format.{}'.format(e))

            logger.debug("Try: processing file...")
            file_bytes = file.read()
            transcription = transcribeAndSave(filename, file_bytes)

            # create response
            data={
                "status": "Success",
                "details": "Transcription of '" + filename + "' saved.",
                "filename": filename,
                "transcription" : transcription,
                "links" : links
            }
            response = jsonify(data)
            response.headers.add('Access-Control-Allow-Origin', '*') #TODO should restrict
            return response
        except Exception as e:
            abort(400, description='Failed to process file.{}'.format(e))

api.add_resource(post_transcribe,'/transcribe')

# iii. GET /transcriptions: Retrieves all transcriptions from the database.
class get_transcriptions(Resource):
    @marshal_with(transcribe_fields)
    def get(self):
        transcriptions = session.query(Transcribe).all()
        for t in session.query(Transcribe).all():
            logger.debug("row obtained>> ".format(t.__dict__))
        if not transcriptions:
            abort(404, description="Transcriptions not found.")
        # response = jsonify(transcriptions)
        # response.headers.add('Access-Control-Allow-Origin', '*') #TODO should restrict
        return (transcriptions)

api.add_resource(get_transcriptions, '/transcriptions')

# iv. GET /search: full-text search on transcriptions based on audio filename.
class get_search(Resource):

    @marshal_with(transcribe_fields)
    def get(self):
        #retrieve search term from query param
        search_term = request.args.get('query')
        logger.debug("search_term>> ".format(search_term))

         # TODO validation

        #query the database for all audio filenames that match search term
        query = (
            session.query(Transcribe.id, Transcribe.created_on, Transcribe.audio_file_name, Transcribe.transcription)
            .join(TranscriptionIndex, Transcribe.id == TranscriptionIndex.rowid)
            .filter(TranscriptionIndex.audio_file_name.match(search_term))
            .order_by(TranscriptionIndex.rank)
        )
        search_result = query.all()
        logger.debug("search_result>> ".format(search_result))

        if not search_result:
            abort(404, description="Transcriptions not found.")
        return (search_result)

api.add_resource(get_search, '/search')

if __name__=='__main__':
    app.run(debug = True)
