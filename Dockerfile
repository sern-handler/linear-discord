FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm i -g typescript
RUN tsc --build

CMD node dist/index.js