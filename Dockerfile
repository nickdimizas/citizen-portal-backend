# Stage 1: Build the TypeScript code
FROM node:20-alpine AS build

WORKDIR /app

COPY .env.docker .env

COPY package*.json ./

RUN npm install

COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Run the compiled JS code
FROM node:20-alpine AS production

WORKDIR /app

COPY .env.docker .env

COPY package*.json ./

ENV HUSKY=0

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
