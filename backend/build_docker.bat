@REM docker-compose build node
@REM docker-compose up dev

@REM docker build --tag python-docker .
@REM docker images
@REM docker run -d -p 5000:5000 python-docker

docker build -t leeshuyun/private-test:v0.0.1-flask-app .
docker run --name my-flask-server -p 5000:5000 leeshuyun/private-test:v0.0.1-flask-app

@REM docker stop my-flask-server
@REM docker rm my-flask-server
