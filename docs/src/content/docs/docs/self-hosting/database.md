---
title: Banco de Dados
description: Configuração de SQLite e PostgreSQL.
---

## SQLite (desenvolvimento)

Configuração padrão para ambiente local.

```ini
DB_CONNECTION=sqlite
```

## PostgreSQL (produção)

```ini
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=saturno
DB_USERNAME=saturno
DB_PASSWORD=changeme
```

## Operações essenciais

```bash
php artisan migrate --force
php artisan db:seed
```

## Recomendações

- habilitar backup automático
- monitorar crescimento de tabelas
- restringir acesso de rede ao banco
