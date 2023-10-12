FROM node:20

RUN mkdir /app
WORKDIR /app

ADD package.json ./
ADD package-lock.json ./
RUN npm i

COPY . .
RUN npm run build
CMD [ "npm", "run", "start" ]
