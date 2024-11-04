# test-htx

This project uses Whisper-tiny API to transcribe .mp3 files, store transcriptions and search for past processed transcription text.

## Quick Start
Windows
- Run `start.bat`

Linux
- TBD

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
pip freeze > requirements.txt
```

### Frontend (Angular)
```
npm install -g @angular/cli
ng new frontend
> CSS
> no Server Side Rendering or Static Site Generation
```

## Dev References
- https://sqlite.org/fts5.html#external_content_tables
- https://docs.sqlalchemy.org/en/20/tutorial/data_select.html#the-select-sql-expression-construct
