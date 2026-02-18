---
title: Deploy em Produção
description: Processo de deploy seguro e repetível para Saturno.
---

## Checklist antes do deploy

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY` definida
- `APP_URL` com domínio real
- banco PostgreSQL provisionado e acessível
- política de backup/restore validada
- worker de fila planejado (`queue:work`)

## Sequência de release (Docker)

```bash
git fetch --all
git checkout main
git pull origin main
docker compose up -d --build
docker compose exec app php artisan migrate --force
```

Se usar cache otimizado em runtime:

```bash
docker compose exec app php artisan optimize
```

## Pós-deploy (smoke test)

```bash
curl -s https://seu-dominio/health
```

Esperado: `{"status":"ok"}`.

Valide também:

- login
- dashboard
- criação/edição de work item
- fluxo de sprint

## Operação contínua

- Monitore logs da aplicação e do worker.
- Acompanhe fila pendente e falhas de jobs.
- Programe atualização periódica de dependências e imagem base.
- Teste restore de backup em ambiente de homologação.
