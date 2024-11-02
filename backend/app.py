from flask import Flask, jsonify, request, abort
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

@app.route('/')
def index():
    return "You've reached the default page!"

# GET /health: Returns the status of the service.
class get_health(Resource):
    def get(self):
        details = {
                "total": 12346,
                "free": 12346,
                "threshold": 12346,
                "exists": "placeholder"
            }
        data={
            "status": "UP",
            "details": details
        }
        return data
api.add_resource(get_health,'/health')

# ii. POST /transcribe: Accepts audio files, transcribe and save results in db.
class post_transcribe(Resource):
    def post(self):
        data={
            "status": "transcribe",
            "details": "placeholder"
        }
        return data
api.add_resource(post_transcribe,'/transcribe')

# iii. GET /transcriptions: Retrieves all transcriptions from the database.
@app.get('/transcriptions')
def get_transcriptions():
    # transcriptions = get_transcription_list()
    transcriptions = {"placeholder": "placeholder"}
    if not transcriptions:
        abort(404, description="Transcriptions not found.")
    return jsonify({'transcriptions': transcriptions})

# iv. GET /search: full-text search on transcriptions based on audio filename.
@app.get('/search')
def get_search():
    # search_result = search_in_db()
    search_result = 0
    if not search_result:
        abort(404, description="Transcriptions not found.")
    return jsonify({'result': search_result})


if __name__=='__main__':
    app.run(debug = True)
