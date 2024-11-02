:: cold start
@REM venv\Scripts\activate.bat
@REM pip install -r requirements.txt
@REM echo %PATH%

:: prod start
@REM venv/Scripts/flask.exe app.py
@REM flask --app backend/app.py run

:: dev start
flask --app app.py --debug run

:: command when done
@REM deactivate
