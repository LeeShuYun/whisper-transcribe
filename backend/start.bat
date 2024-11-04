:: cold start
@REM python3 -m venv venv
@REM venv\Scripts\activate
@REM pip install -r requirements.txt
@REM echo %PATH%
@REM python init_db.py

:: prod start
@REM venv/Scripts/flask.exe app.py
@REM flask --app backend/app.py run

:: dev start
flask --app src\app.py --debug run

:: command when done
@REM deactivate
