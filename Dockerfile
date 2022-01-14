FROM node:16-buster

#React project copy
RUN mkdir /app
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT [ "npm","start"]