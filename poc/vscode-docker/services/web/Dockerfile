FROM node:22-alpine@sha256:<digest> AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS dev
RUN apk add --no-cache git curl bash vim
RUN useradd -ms /bin/bash appuser
USER appuser

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:alpine@sha256:<digest> AS prod
COPY --from=build /app/dist /usr/share/nginx/html