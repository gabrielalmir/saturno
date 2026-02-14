---
title: Configuração
description: Ajustes iniciais de ambiente, banco de dados e execução.
---

## Arquivo `.env`

Use `.env` para definir parâmetros de aplicação, banco e filas.

```bash
cp .env.example .env
```

## Configurações mínimas

```ini
APP_NAME=Saturno
APP_ENV=local
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
QUEUE_CONNECTION=database
```

## Usando PostgreSQL

```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=saturno
DB_USERNAME=saturno
DB_PASSWORD=changeme
```

Após alteração de banco:

```bash
php artisan migrate --force
```

## Ajustes de segurança para produção

- Defina `APP_ENV=production`.
- Defina `APP_DEBUG=false`.
- Gere `APP_KEY` única por ambiente.
- Utilize senha forte para banco e rotação periódica.
