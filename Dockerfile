# syntax=docker/dockerfile:1

# Default image: Postgres only (smaller, Alpine-based).

ARG PHP_VERSION=8.5
ARG NODE_VERSION=24

# Node tooling stage
FROM node:${NODE_VERSION}-alpine AS node-tooling

# Build stage (PHP + Composer + Node)
FROM php:${PHP_VERSION}-cli-alpine AS build
WORKDIR /app

# Alpine: install runtime libs + build deps (removed after compiling extensions).
# Only supported DB driver: Postgres (pdo_pgsql).
RUN apk add --no-cache \
      git \
      unzip \
      icu-libs \
      libzip \
      libpq \
  && apk add --no-cache --virtual .build-deps \
      $PHPIZE_DEPS \
      icu-dev \
      libzip-dev \
      postgresql-dev \
  && docker-php-ext-install bcmath intl pdo_pgsql zip \
  && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY --from=node-tooling /usr/local/ /usr/local/

COPY composer.json composer.lock ./
COPY package.json package-lock.json ./
RUN composer install --no-dev --no-interaction --no-ansi --no-progress --prefer-dist --no-scripts

# Some npm deps may use node-gyp; keep toolchain in the build stage only.
RUN apk add --no-cache --virtual .node-build-deps python3 make g++
RUN npm ci

COPY . ./

# .dockerignore excludes runtime/build artefacts (including bootstrap/cache).
# Laravel's post-autoload scripts need bootstrap/cache to exist and be writable.
RUN mkdir -p bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
  && chmod -R ug+rwx bootstrap/cache storage

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer dump-autoload --optimize

# Ensure production build artifacts; avoid requiring any runtime secrets at build time.
# Keep DB connection set to pgsql to prevent any sqlite coupling in build scripts.
ENV APP_ENV=production \
    DB_CONNECTION=pgsql

# If a local Vite dev-server "hot" file exists, remove it so production never points at 127.0.0.1:5173.
RUN rm -f public/hot
RUN npm run build

# The runtime stage copies /app; remove build-only JS deps and sources so they
# don't bloat the final image.
RUN apk del .node-build-deps \
  && rm -rf node_modules \
    resources/js \
    resources/css \
    docker \
  && rm -f package.json package-lock.json \
    tsconfig.json vite.config.ts eslint.config.js components.json \
    playwright.config.ts

# Runtime stage (Nginx + PHP-FPM)
FROM php:${PHP_VERSION}-fpm-alpine AS runtime
WORKDIR /var/www/html

RUN apk add --no-cache \
      nginx \
      supervisor \
      icu-libs \
      libzip \
      libpq

COPY --from=build /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=build /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

COPY --from=build /app /var/www/html

# Alpine nginx loads /etc/nginx/http.d/*.conf by default.
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisor/supervisord.conf /etc/supervisord.conf

# Use explicit PHP-FPM config to avoid image defaults drifting and to ensure env passthrough.
COPY docker/php-fpm/php-fpm.conf /usr/local/etc/php-fpm.conf
COPY docker/php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN mkdir -p storage/logs \
  && mkdir -p storage/framework/cache \
  && mkdir -p storage/framework/sessions \
  && mkdir -p storage/framework/views \
  && mkdir -p bootstrap/cache \
  && mkdir -p /run/php /run/nginx /var/log/supervisor \
  && chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R ug+rwx storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    DB_CONNECTION=pgsql \
    DB_SSLMODE=require \
    PGSSLMODE=require \
    PORT=8080

EXPOSE 8080

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

