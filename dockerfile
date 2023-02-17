FROM node:14.15.4
COPY . /app/homium
RUN apt-get update
RUN apt-get install -y libasound2-dev
RUN apt-get install -y htop
RUN apt-get install -y git
RUN apt-get install -y curl
RUN cd /app/homium && npm install
RUN apt-get remove -y
RUN apt-get autoremove -y
RUN apt-get clean
RUN rm -rf /tmp/* /app/tmp/*
WORKDIR /app/homium
CMD ["npm", "run", "start-backend"]
EXPOSE 3000