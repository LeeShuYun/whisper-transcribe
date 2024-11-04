from flask import Flask, jsonify, request, abort
from flask_restful import Api, Resource, fields, marshal_with, request
from .entities.entity import Session, engine, Base, Transcribe, TranscriptionIndex, transcribe_fields
from sqlalchemy import select, insert
from sqlalchemy.sql import text
import json
import os
from .services.whispertiny import audio_to_text
from .config.config import DevelopmentConfig

print("In module products __package__, __name__ ==", __package__, __name__)

Base.metadata.create_all(engine)
session = Session()

app = Flask(__name__)
api = Api(app)

@app.route('/')
def index():
    """ Returns details about service according to HATEOAS"""
    data = {
        "version": "1.0",
        "links": [
            {
                "href": "/transcribe",
                "rel": "create",
                "method": "POST"
            },
            {
                "href": "/health",
                "rel": "self",
                "method": "GET"
            },
            {
                "href": "/transcriptions",
                "rel": "list",
                "method": "GET"
            },
            {
                "href": "/search",
                "rel": "list",
                "method": "GET"
            }
        ]
    }
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*') #TODO should restrict for prod
    return response

# GET /health: Returns the status of the service.
class get_health(Resource):
    def get(self):
        links = [
            {
                "href": "/transcribe",
                "rel": "create",
                "method": "POST"
            },
            {
                "href": "/health",
                "rel": "self",
                "method": "GET"
            },
            {
                "href": "/transcriptions",
                "rel": "list",
                "method": "GET"
            },
            {
                "href": "/search",
                "rel": "list",
                "method": "GET"
            }
        ]
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
        try:
            # extract file from request body
            file = request.files['audio']
            print(file)

            print("processing file...")
            if not file:
                abort(400, message='Empty file.')
            filename = request.files['audio'].filename
            if not filename.lower().endswith(('.mp3', '.wav')):
                abort(400, message='Wrong file format: {}'.format(e))
            file_bytes = file.read()
            transcription = audio_to_text(file_bytes)
            print(transcription)
            transcribe_record = Transcribe(filename, transcription)
            session.add(transcribe_record)
            session.commit()
        except Exception as e:
            abort(400, message='Failed to process file: {}'.format(e))
        # TODO should handle the linking elegantly
        links = [
            {
                "href": "/transcribe",
                "rel": "create",
                "method": "POST"
            },
            {
                "href": "/transcriptions",
                "rel": "list",
                "method": "GET"
            },
            {
                "href": "/search",
                "rel": "list",
                "method": "GET"
            }
        ]
        response={
            "status": "Success",
            "details": "Transcription of '" + filename + "' saved.",
            "links" : links
        }

        response = jsonify(response)
        response.headers.add('Access-Control-Allow-Origin', '*') #TODO should restrict
        return response

api.add_resource(post_transcribe,'/transcribe')

# iii. GET /transcriptions: Retrieves all transcriptions from the database.
class get_transcriptions(Resource):
    @marshal_with(transcribe_fields)
    def get(self):
        transcriptions = session.query(Transcribe).all()
        for t in session.query(Transcribe).all():
            print (t.__dict__)
        if not transcriptions:
            abort(404, description="Transcriptions not found.")
        return (transcriptions)

api.add_resource(get_transcriptions, '/transcriptions')

# iv. GET /search: full-text search on transcriptions based on audio filename.
class get_search(Resource):

    @marshal_with(transcribe_fields)
    def get(self):
        #retrieve search term from query param
        search_term = request.args.get('query')
        print(search_term)

         # TODO validation

        #query the database for all audio filenames that match search term
        query = (
            session.query(Transcribe.id, Transcribe.created_on, Transcribe.audio_file_name, Transcribe.transcription)
            .join(TranscriptionIndex, Transcribe.id == TranscriptionIndex.rowid)
            .filter(TranscriptionIndex.audio_file_name.match(search_term))
            .order_by(TranscriptionIndex.rank)
        )
        search_result = query.all()
        print(search_result)

        if not search_result:
            abort(404, description="Transcriptions not found.")
        return (search_result)

api.add_resource(get_search, '/search')

if __name__=='__main__':
    app.run(debug = True)
