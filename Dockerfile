FROM node:16-bullseye-slim

RUN mkdir /app
WORKDIR /app

ADD package.json ./
ADD yarn.lock ./
RUN yarn install

COPY . .
RUN yarn run build
CMD [ "yarn", "run", "start" ]
