FROM --platform=$BUILDPLATFORM oven/bun:1 as build
# Set working directory
WORKDIR /build

COPY package.json bun.lockb /build/
RUN bun install
COPY . .

FROM --platform=$TARGETARCH node:20

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/ .
CMD [ "sh", "-c", "bun run build && bun run start" ]

