---
title: Deploy em Produção
description: Checklist e processo para deploy seguro.
---

## Checklist de produção

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY` configurada
- TLS ativo no domínio
- backups validados

## Processo de atualização

```bash
git pull origin main
docker compose build
docker compose up -d
docker compose exec app php artisan migrate --force
```

## Operação contínua

- monitorar filas e erros de aplicação
- revisar logs de autenticação
- aplicar patches de segurança periodicamente
