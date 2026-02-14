---
title: Rodando Localmente
description: Execução local para desenvolvimento e validação.
---

## Via Composer

```bash
composer setup
composer dev
```

Serviços padrão:

- app Laravel
- worker de fila
- Vite com HMR

## Via Docker Compose

```bash
cp .env.example .env
docker compose run --rm app php artisan key:generate
docker compose up -d
docker compose exec app php artisan migrate --force
```

Acesso local: `http://localhost:8080`.
