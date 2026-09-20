---
title: Banco de Dados
description: Estratégias de banco para Docker, desenvolvimento local e produção.
---

## Banco padrão do projeto atual

O fluxo oficial usa **PostgreSQL**.

No `docker-compose.yml`, o serviço `db` utiliza `postgres:17-alpine`.

## Configuração recomendada (Docker)

```ini
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=saturno
DB_USERNAME=saturno
DB_PASSWORD=changeme
```

## Configuração local com PostgreSQL

```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=saturno
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

## Configuração local com SQLite (dev rápido)

```ini
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Crie o arquivo antes de migrar:

```bash
touch database/database.sqlite
```

## Operações essenciais

```bash
php artisan migrate --force
php artisan migrate:status
php artisan db:seed
```

## Boas práticas em produção

- backup com retenção e teste de restore
- usuário de banco com menor privilégio
- monitoramento de crescimento e índices
- conexão TLS entre app e banco quando aplicável
