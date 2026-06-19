FROM node:24-alpine

WORKDIR /app

COPY package.json ./
RUN npm i

COPY src ./src

EXPOSE 8082

CMD ["node", "src/server.ts"]
