# syntax=docker/dockerfile:1

FROM python:3.11.10-alpine AS py_builder

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY requirements.txt .
# Installs without caching to get the latest versions
RUN pip3 install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install git -y
RUN pip3 install "git+https://github.com/openai/whisper.git"
RUN apt-get install -y ffmpeg

COPY . .

EXPOSE 5000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
