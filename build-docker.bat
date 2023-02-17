@echo off

set DOCKER_IMAGE=homium
set MEMORY=2g

docker build -m %MEMORY% -t %DOCKER_IMAGE% .
