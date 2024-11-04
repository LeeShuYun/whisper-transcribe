from flask import Flask, jsonify, request, abort
from flask_restful import Api, Resource, fields, marshal_with, request
from .entities.entity import Session, engine, Base, Transcribe, TranscriptionIndex, transcribe_fields
from sqlalchemy import select, insert
from sqlalchemy.sql import text
import json

print("In module products __package__, __name__ ==", __package__, __name__)

Base.metadata.create_all(engine)
session = Session()

app = Flask(__name__)
api = Api(app)

@app.route('/')
def index():
    """ Returns details about service according to HATEOAS"""
    details = {
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
    return details

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
        return data
api.add_resource(get_health,'/health')

# ii. POST /transcribe: Accepts audio files, transcribe and save results in db.
class post_transcribe(Resource):
    def post(self):
        filename = "placeholder"
        transcription = Transcribe("test1", "test2", "test3")
        session.add(transcription)
        session.commit()

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
        data={
            "status": "Success",
            "details": "Transcription of '" + filename + "' saved.",
            "links" : links
        }
        return data
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
