FROM node:16
RUN apt-get update
RUN apt-get install -y libasound2-dev
RUN apt-get install -y htop
RUN apt-get install -y git
RUN apt-get install -y curl
RUN apt-get install -y nano
RUN npm install -g npm
RUN apt-get remove -y
RUN apt-get autoremove -y
RUN apt-get clean
RUN rm -rf /tmp/*
RUN mkdir -p /app/homium
WORKDIR /app/homium
RUN echo "cd /app/homium && git clone https://github.com/VoDACode/Homium . && npm install" >> /app/downoad.sh
CMD []
EXPOSE 3000