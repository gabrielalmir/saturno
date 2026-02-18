---
title: Instalação
description: Opções de instalação alinhadas ao estado atual do Saturno.
---

## Escolha o modo de instalação

- **Docker Compose (recomendado)**: caminho mais rápido e consistente para desenvolvimento e homologação.
- **Host local (avançado)**: roda PHP/Node/PostgreSQL diretamente na máquina.
- **Container em produção**: build de imagem + execução com banco externo.

## Opção 1: Docker Compose (recomendado)

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
cp .env.example .env
docker compose run --rm app php artisan key:generate
docker compose up -d --build
docker compose exec app php artisan migrate --force
```

Acesso padrão: `http://localhost:8080`.

## Opção 2: Host local (sem Docker)

Use este fluxo apenas se você já tem runtime local preparado.

### Dependências

- PHP 8.2+
- Composer 2+
- Node.js 20+ e npm
- PostgreSQL 17+ (ou SQLite para dev rápido)

### Passos

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
cp .env.example .env
```

Ajuste `.env` para seu banco local (ex.: PostgreSQL em `127.0.0.1` ou SQLite), depois:

```bash
composer setup
composer dev
```

Por padrão, `composer dev` expõe a aplicação em `http://localhost:8000`.

## Opção 3: Build para produção

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
cp .env.example .env
# ajuste variáveis de produção no .env

docker build -t saturno:latest .
# execute com seu orquestrador e banco PostgreSQL externo
```

Depois do container no ar:

```bash
php artisan migrate --force
```

## Verificação mínima pós-instalação

- `/health` responde `{"status":"ok"}`.
- Tela de login abre sem erro.
- Migrations executaram sem falha.
- Fila está processando jobs (quando aplicável).
