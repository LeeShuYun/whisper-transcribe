# syntax=docker/dockerfile:1

# FROM python:3.11.10-alpine AS py_builder

# RUN set -xe \
#     && apk add --no-cache bash git openssh \
#     git --version && bash --version && ssh -V


# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# WORKDIR /usr/src/app

# COPY requirements.txt .
# # Installs without caching to get the latest versions
# RUN apk add ffmpeg && ffmpeg -version
# RUN pip3 install --no-cache-dir -r requirements.txt
# RUN pip3 install "git+https://github.com/openai/whisper.git"

# COPY . .

# EXPOSE 5000

# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]

FROM python:3.11-alpine

# Set up environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /app

# Copy only the requirements file first to leverage Docker caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code
COPY . .

# Expose the port your application will run on
EXPOSE 5000

# Specify the command to run on container start
CMD ["python", "src/app.py"]

