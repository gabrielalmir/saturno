---
title: Introdução
description: Visão geral do Saturno, arquitetura operacional e fluxo recomendado.
---

Saturno é uma plataforma para planejamento e execução de trabalho técnico com foco em sprint, capacidade e visibilidade operacional.

## O que você encontra no produto

- gestão por organização/projeto com controle de papéis
- planejamento e execução de sprints
- board de sprint e calendário
- gestão de work items e épicos
- integrações com provedores externos (Jira, Trello, Todoist)

## Como o sistema roda hoje

- **App web**: Laravel + Inertia/React
- **Banco**: PostgreSQL (padrão atual do projeto)
- **Fila**: driver `database`
- **Healthcheck**: `GET /health`

## Fluxo recomendado para começar

1. Execute o **[Quick Start](/docs/getting-started/quick-start/)** (Docker Compose).
2. Ajuste parâmetros em **[Configuração](/docs/getting-started/configuration/)**.
3. Siga **[Primeiro Projeto](/docs/guides/first-project/)** para operacionalizar o uso.
