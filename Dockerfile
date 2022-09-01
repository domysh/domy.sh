FROM node:16-bullseye-slim

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

ADD package*.json ./
RUN npm ci

COPY . .
RUN npm run build
CMD [ "npm","start" ]
