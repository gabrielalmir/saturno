---
title: Quick Start
description: Suba o Saturno rapidamente com Docker Compose e valide o fluxo principal.
---

Este guia usa o caminho mais previsível para começar: **Docker Compose + PostgreSQL** (padrão do projeto atual).

## Pré-requisitos

- Docker 24+ e Docker Compose (plugin)
- Porta `8080` livre para a aplicação
- Git

## 1. Clonar o repositório

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
```

## 2. Criar arquivo de ambiente

```bash
cp .env.example .env
```

## 3. Gerar `APP_KEY`

```bash
docker compose run --rm app php artisan key:generate
```

## 4. Subir aplicação e banco

```bash
docker compose up -d --build
```

## 5. Executar migrations

```bash
docker compose exec app php artisan migrate --force
```

## 6. Validar saúde da aplicação

- Aplicação: `http://localhost:8080`
- Healthcheck: `http://localhost:8080/health` (resposta esperada: `{"status":"ok"}`)

## 7. Primeiro acesso funcional

1. Crie sua conta.
2. Crie uma organização.
3. Crie um projeto/equipe.
4. Abra **Sprint Planning** e inicie sua primeira sprint.

## Próximos passos recomendados

1. Ajuste variáveis em **[Configuração](/docs/getting-started/configuration/)**.
2. Se for operar sem Docker, veja **[Rodando Localmente](/docs/self-hosting/running-locally/)**.
3. Para produção, siga **[Deploy em Produção](/docs/self-hosting/production-deploy/)**.
