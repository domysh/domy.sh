FROM --platform=$BUILDPLATFORM node as build
# Set working directory
ENV NODE_ENV=production
WORKDIR /build

COPY package.json package-lock.json /build/
RUN npm install
COPY . .

FROM --platform=$TARGETARCH node

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/ .
CMD [ "sh", "-c", "npm run build && npm run start" ]

