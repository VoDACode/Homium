@echo off

set DOCKER_IMAGE=homium
set CONTAINER_NAME=homium
set MEMORY=2g

docker run -d -m %MEMORY% -p 3000:3000 --name %CONTAINER_NAME% %DOCKER_IMAGE%
docker build -m %MEMORY% -t %DOCKER_IMAGE% .