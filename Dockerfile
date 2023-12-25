FROM --platform=$BUILDPLATFORM node:20 as build
# Set working directory
WORKDIR /build

COPY package.json ./
RUN npm install
COPY . .

FROM --platform=$TARGETARCH node:20

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/ .
CMD [ "sh", "-c", "npm run build && npm run start" ]


