FROM --platform=$BUILDPLATFORM node:20 as build
# Set working directory
WORKDIR /build
ENV NODE_ENV=production

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM --platform=$TARGETARCH node:20

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next/
COPY --from=build /build/public ./public/
COPY --from=build /build/node_modules ./node_modules/
COPY --from=build /build/next.config.js ./
CMD [ "npm", "run", "start" ]


