---
title: Instalação
description: Métodos de instalação para ambiente local e servidor.
---

## Opções suportadas

- Instalação local para desenvolvimento.
- Deploy com Docker Compose.
- Instalação manual em servidor Linux.

## Instalação local

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
composer setup
composer dev
```

## Instalação com Docker

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
cp .env.example .env
docker compose run --rm app php artisan key:generate
docker compose up -d
docker compose exec app php artisan migrate --force
```

Acesso padrão: `http://localhost:8080`.

## Instalação manual (produção)

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
cp .env.example .env
php artisan key:generate
php artisan migrate --force
```

Use um servidor HTTP reverso (Nginx/Apache) e processo de fila em segundo plano.
