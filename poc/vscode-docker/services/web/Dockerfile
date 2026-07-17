FROM node:22-alpine@sha256:<digest> AS base
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY services/web/package.json ./services/web/
RUN npm ci

FROM base AS dev
RUN apk add --no-cache git curl bash vim
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} appuser \
  && useradd -u ${UID} -g ${GID} -m -s /bin/bash appuser
USER appuser

FROM base AS build
COPY services/web/ ./services/web/
RUN npm run build --workspace=services/web

FROM nginx:alpine@sha256:<digest> AS prod
COPY --from=build /repo/services/web/dist /usr/share/nginx/html