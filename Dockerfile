FROM node:16-bullseye-slim

RUN mkdir /app
WORKDIR /app

ADD package*.json ./
RUN npm ci --ignore-engines

COPY . .
RUN npm run build
CMD [ "npm","start" ]
