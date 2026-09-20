---
title: Docker
description: Operação do Saturno com Docker Compose.
---

## Subida inicial

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
cp .env.example .env
docker compose run --rm app php artisan key:generate
docker compose up -d --build
docker compose exec app php artisan migrate --force
```

## Comandos operacionais

```bash
docker compose ps
docker compose logs -f app
docker compose exec app php artisan about
docker compose exec app php artisan migrate:status
```

## Fila de jobs (importante)

O `docker-compose.yml` padrão sobe `app` e `db`. Para processar filas com `QUEUE_CONNECTION=database`, execute worker em processo separado:

```bash
docker compose exec app php artisan queue:work --tries=1 --timeout=0
```

Em produção, rode este comando como serviço dedicado (container/worker separado).

## Atualização da aplicação

```bash
git pull origin main
docker compose up -d --build
docker compose exec app php artisan migrate --force
```

## Parada e limpeza

```bash
docker compose down
# opcional: remover volumes (inclui banco)
docker compose down -v
```
