
FROM node:20-alpine AS production

WORKDIR /app

COPY .env.docker .env

COPY package*.json ./

ENV HUSKY=0

RUN npm ci

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
