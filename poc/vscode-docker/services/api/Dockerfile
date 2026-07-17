FROM php:8.3-fpm-bookworm@sha256:<digest> AS base
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --no-dev

FROM base AS dev
RUN apt-get update && apt-get install -y --no-install-recommends \
  git curl bash unzip vim \
  && rm -rf /var/lib/apt/lists/* \
  && pecl install xdebug \
  && docker-php-ext-enable xdebug
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} appuser \
  && useradd -u ${UID} -g ${GID} -m -s /bin/bash appuser
USER appuser

FROM base AS prod
COPY . .
RUN composer dump-autoload --optimize