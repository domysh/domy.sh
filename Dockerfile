FROM --platform=$BUILDPLATFORM docker.io/oven/bun AS build
# Set working directory
ENV NODE_ENV=production
WORKDIR /build

COPY package.json bun.lock /build/
RUN bun i
COPY . .

FROM --platform=$TARGETARCH docker.io/oven/bun

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/ .
CMD [ "sh", "-c", "bun run build && bun run start" ]

