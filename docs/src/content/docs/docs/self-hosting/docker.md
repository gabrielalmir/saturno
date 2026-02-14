---
title: Docker
description: Fluxo oficial de execução com Docker Compose.
---

## Subida inicial

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
cp .env.example .env
docker compose run --rm app php artisan key:generate
docker compose up -d
docker compose exec app php artisan migrate --force
```

## Comandos úteis

```bash
docker compose ps
docker compose logs -f app
docker compose exec app php artisan queue:work
```

## Parada do ambiente

```bash
docker compose down
```
