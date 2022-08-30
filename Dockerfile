FROM node:16-alpine

#React project copy
RUN apk add --update npm
RUN npm install -g npm@latest
RUN mkdir /app
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm ci -f
COPY . .
RUN npm run build
ENTRYPOINT [ "npm","start" ]