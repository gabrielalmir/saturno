---
title: Quick Start
description: Rode o Saturno localmente em menos de 5 minutos.
---

Este fluxo inicializa uma instância local com configuração padrão.

## Pré-requisitos

- PHP 8.2+
- Composer 2+
- Node.js 18+ e npm
- SQLite (padrão) ou PostgreSQL

## 1. Clonar o repositório

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
```

## 2. Setup automático

```bash
composer setup
```

O comando prepara ambiente, instala dependências, cria `.env`, gera chave e executa migrations.

## 3. Subir ambiente local

```bash
composer dev
```

A aplicação ficará disponível em `http://localhost:8000`.

## 4. Primeiro login

1. Acesse `http://localhost:8000`.
2. Crie a conta administrativa inicial.
3. Entre no sistema com as credenciais criadas.

## 5. Primeiro projeto

1. Crie uma organização.
2. Crie ao menos uma equipe.
3. Crie a primeira sprint com período e capacidade.

## 6. Primeiro work item

1. Abra o board da sprint.
2. Crie um work item com título, prioridade e responsável.
3. Mova o item para a coluna de execução.

## Verificação rápida

- Interface acessível em `http://localhost:8000`.
- Organização e sprint visíveis no painel.
- Work item criado e rastreável no board.
