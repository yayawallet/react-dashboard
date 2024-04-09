FROM node:21-alpine

WORKDIR /app

RUN npm install --global http-server

COPY ./dist .

EXPOSE 3030

CMD ["http-server", ".", "-p 3030"]