---
title: Docker Hub (SQL Server)
description: Install Saturno using the gabrielalmir/saturno:sqlserver image with SQL Server.
---

## Overview

This guide shows how to run Saturno using the Docker Hub image `gabrielalmir/saturno:sqlserver`.

Flow:

1. create a Docker network
2. start a SQL Server container
3. start Saturno pointing to that database
4. run migrations

## Prerequisites

- Docker 24+ (with `docker compose` plugin, optional)
- Port `8080` available (Saturno)
- Port `1433` available (SQL Server)

## 1) Pull the Saturno image

```bash
docker pull gabrielalmir/saturno:sqlserver
```

## 2) Create a dedicated network

```bash
docker network create saturno-net
```

## 3) Start SQL Server

Set a strong password for the `sa` user:

```bash
export MSSQL_SA_PASSWORD='YourStrong!Passw0rd'
```

Start the database:

```bash
docker run -d \
  --name saturno-sqlserver-db \
  --network saturno-net \
  -e ACCEPT_EULA=Y \
  -e MSSQL_SA_PASSWORD="$MSSQL_SA_PASSWORD" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

## 4) Start Saturno from Docker Hub

Generate a Laravel app key:

```bash
export APP_KEY="base64:$(openssl rand -base64 32)"
```

Start the app:

```bash
docker run -d \
  --name saturno-sqlserver-app \
  --network saturno-net \
  -p 8080:8080 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_URL=http://localhost:8080 \
  -e APP_KEY="$APP_KEY" \
  -e DB_CONNECTION=sqlsrv \
  -e DB_HOST=saturno-sqlserver-db \
  -e DB_PORT=1433 \
  -e DB_DATABASE=saturno \
  -e DB_USERNAME=sa \
  -e DB_PASSWORD="$MSSQL_SA_PASSWORD" \
  -e DB_ENCRYPT=true \
  -e DB_TRUST_SERVER_CERTIFICATE=true \
  gabrielalmir/saturno:sqlserver
```

## 5) Run migrations

After the app is running:

```bash
docker exec -it saturno-sqlserver-app php artisan migrate --force
```

## 6) Verification

- App: `http://localhost:8080`
- Healthcheck: `http://localhost:8080/health`

Useful logs:

```bash
docker logs -f saturno-sqlserver-app
docker logs -f saturno-sqlserver-db
```

## Docker Compose example

Create a `docker-compose.yml` file:

```yaml
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: saturno-sqlserver-db
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "${MSSQL_SA_PASSWORD}"
    ports:
      - "1433:1433"
    healthcheck:
      test: ["CMD-SHELL", "/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $$MSSQL_SA_PASSWORD -Q 'SELECT 1' -C"]
      interval: 10s
      timeout: 5s
      retries: 10

  app:
    image: gabrielalmir/saturno:sqlserver
    container_name: saturno-sqlserver-app
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"
    environment:
      APP_ENV: production
      APP_DEBUG: "false"
      APP_URL: http://localhost:8080
      APP_KEY: "${APP_KEY}"
      DB_CONNECTION: sqlsrv
      DB_HOST: db
      DB_PORT: "1433"
      DB_DATABASE: saturno
      DB_USERNAME: sa
      DB_PASSWORD: "${MSSQL_SA_PASSWORD}"
      DB_ENCRYPT: "true"
      DB_TRUST_SERVER_CERTIFICATE: "true"
```

Set the required variables:

```bash
export MSSQL_SA_PASSWORD='YourStrong!Passw0rd'
export APP_KEY="base64:$(openssl rand -base64 32)"
```

For certificate validation in production, prefer:

```bash
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

Start everything:

```bash
docker compose up -d
docker compose exec app php artisan migrate --force
```

## Update to a newer version

```bash
docker pull gabrielalmir/saturno:sqlserver
docker rm -f saturno-sqlserver-app
# start it again using the same command from section 4
```

## Removal

```bash
docker rm -f saturno-sqlserver-app saturno-sqlserver-db
docker network rm saturno-net
```
