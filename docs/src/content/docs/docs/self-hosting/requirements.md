---
title: Requisitos
description: Requisitos mínimos e recomendados para rodar Saturno com estabilidade.
---

## Requisitos de infraestrutura

### Ambiente de avaliação / pequeno time

- 2 vCPU
- 4 GB RAM
- 20 GB SSD

### Ambiente de produção inicial

- 4 vCPU
- 8 GB RAM
- 50 GB SSD
- backup de banco diário

## Dependências de runtime

- Docker 24+
- Docker Compose (plugin) 2.20+
- PostgreSQL 17+ (a stack padrão usa `postgres:17-alpine`)

Alternativa sem Docker:

- PHP 8.2+
- Composer 2+
- Node.js 20+ e npm
- PostgreSQL 17+ ou SQLite (apenas dev)

## Rede e portas

- Aplicação HTTP: `8080` (padrão)
- Banco PostgreSQL: `5432` (interno no compose)
- Endpoint de healthcheck: `/health`

## Segurança operacional mínima

- TLS no domínio público
- `APP_DEBUG=false` fora de desenvolvimento
- segredos gerenciados fora do repositório
- política de backup e restore testada
