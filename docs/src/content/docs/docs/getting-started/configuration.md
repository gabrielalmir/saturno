---
title: Configuração
description: Como ajustar ambiente, banco, fila e execução no Saturno.
---

## 1. Arquivo de ambiente

```bash
cp .env.example .env
```

O projeto já fornece `.env.example` com baseline de produção em Docker (`APP_URL=http://localhost:8080` e PostgreSQL).

## 2. Perfis de configuração

### Docker Compose (padrão recomendado)

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8080
APP_PORT=8080

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=saturno
DB_USERNAME=saturno
DB_PASSWORD=changeme

QUEUE_CONNECTION=database
SESSION_DRIVER=database
CACHE_STORE=database
MAIL_MAILER=log
```

### Host local com PostgreSQL

```ini
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=saturno
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### Host local com SQLite (desenvolvimento)

```ini
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Crie o arquivo de banco antes das migrations:

```bash
touch database/database.sqlite
```

## 3. Aplicar alterações com segurança

Sempre que alterar `.env`, execute:

```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate --force
```

## 4. Observações operacionais

- `QUEUE_CONNECTION=database` exige tabelas de fila migradas.
- `SESSION_DRIVER=database` e `CACHE_STORE=database` exigem conectividade estável com o banco.
- Em produção, mantenha `APP_DEBUG=false` e nunca versione segredos reais.
