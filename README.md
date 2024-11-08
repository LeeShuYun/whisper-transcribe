# Whisper Transcribe

This project uses OpenAI's Whisper-tiny to transcribe .mp3 files, store transcriptions and search for existing transcription text in the database.

## Quick Start
Windows
- Run `start.bat`

Linux
- Run `start.sh`

## Run tests
`ng test` - run Angular tests
`test_app.bat` or `test_app.sh` - run Flask tests

## Tests 
## Frontend
1. POST "/transcribe" uploadTranscribe() success check - being able to transcribe something is the most important part of the whole app
2. POST "/transcribe" uploadTranscribe() failure check - making sure the error handling for the most important part of the app works
3. html element rendering - every view uses the same method of displaying the fetched data, so it should at least be displaying correctly
## Backend
1. Transcribe `__init__` test  - main entity class must work
2. GetAllTransactions query - even if uploads break at least previously processed data can be seen.
3. transcribeAndSave() unit test

## Stack
Backend
- Flask-RESTful
- SQLite

Frontend
- Angular

## Commands used to set this up
### Backend (Flask)
```
python -m venv venv
venv\Scripts\activate
pip install Flask
pip install Flask-RESTful
pip install sqlalchemy
pip install transformers torch torchvision torchaudio
pip install flask-cors
pip freeze > requirements.txt
```

### Frontend (Angular)
```
npm install -g @angular/cli
ng new frontend
> CSS
> no Server Side Rendering or Static Site Generation
ng g config karma
```

## Dev References
- https://sqlite.org/fts5.html#external_content_tables
- https://docs.sqlalchemy.org/en/20/tutorial/data_select.html#the-select-sql-expression-construct
- https://werkzeug.palletsprojects.com/en/stable/datastructures/#werkzeug.datastructures.FileStorage
- https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm#sec_5_1_5
- https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
- https://angular.dev/reference/migrations/standalone
- https://github.com/corydolphin/flask-cors
- https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types
- https://www.npmjs.com/package/ngx-file-drop
- https://stackoverflow.com/questions/61841672/no-matching-distribution-found-for-torch-1-5-0cpu-on-heroku
- https://pytorch.org/get-started/locally/
- https://stackoverflow.com/questions/56239310/could-not-find-a-version-that-satisfies-the-requirement-torch-1-0-0
- https://www.npmjs.com/package/ngx-file-drop
