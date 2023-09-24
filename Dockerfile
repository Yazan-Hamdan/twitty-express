FROM node:15.5.0-slim AS base

RUN apt-get update

WORKDIR /application
COPY package*.json ./

RUN npm install --include-dev

COPY . ./

# production
FROM base AS production

RUN npm run build

# development
FROM base AS development

EXPOSE 8001
