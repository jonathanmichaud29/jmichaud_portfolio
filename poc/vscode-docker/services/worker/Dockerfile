FROM python:3.12-slim-bookworm@sha256:<digest> AS base
WORKDIR /app
COPY pyproject.toml ./
RUN pip install --no-cache-dir .

FROM base AS dev
RUN pip install --no-cache-dir debugpy \
  && apt-get update && apt-get install -y --no-install-recommends \
  git curl bash vim \
  && rm -rf /var/lib/apt/lists/*
RUN useradd -ms /bin/bash appuser
USER appuser

FROM base AS prod
COPY . .