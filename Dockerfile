# Build stage
FROM node:lts-alpine AS build

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build

# Final stage
FROM node:lts-alpine AS final

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

CMD ["node", "dist/index.js"]