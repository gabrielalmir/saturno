---
title: Rodando Localmente
description: Fluxos locais com Docker Compose (recomendado) e host nativo (avançado).
---

## Fluxo recomendado: Docker Compose

```bash
cp .env.example .env
docker compose run --rm app php artisan key:generate
docker compose up -d --build
docker compose exec app php artisan migrate --force
```

Acesso: `http://localhost:8080`

Verificação rápida:

```bash
curl -s http://localhost:8080/health
# esperado: {"status":"ok"}
```

## Fluxo alternativo: Host local

Use quando você precisa depurar PHP/Node sem containers.

1. Ajuste `.env` para banco local (PostgreSQL/SQLite).
2. Rode setup e ambiente de desenvolvimento:

```bash
composer setup
composer dev
```

Acesso padrão: `http://localhost:8000`.

## Problemas comuns

- **Erro de conexão com banco no `composer setup`**
  - Revise `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
- **`APP_KEY` ausente**
  - Execute `php artisan key:generate`.
- **Tela abre mas ações assíncronas não processam**
  - Inicie worker de fila (`php artisan queue:listen` no host ou `php artisan queue:work` em processo/container dedicado).
