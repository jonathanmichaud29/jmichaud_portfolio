FROM python:3.12-slim-bookworm@sha256:<digest> AS base
WORKDIR /app
COPY pyproject.toml ./
RUN pip install --no-cache-dir .

FROM base AS dev
RUN pip install --no-cache-dir debugpy \
  && apt-get update && apt-get install -y --no-install-recommends \
  git curl bash vim \
  && rm -rf /var/lib/apt/lists/*
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} appuser \
  && useradd -u ${UID} -g ${GID} -m -s /bin/bash appuser
USER appuser

FROM base AS prod
COPY . .