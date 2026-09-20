---
title: API
description: Referência dos endpoints internos atualmente expostos no Saturno.
---

## Escopo atual da API

A API do Saturno é **interna** e orientada ao front-end da própria aplicação.

- Não há versionamento público (`/v1`, `/v2`) no estado atual.
- Endpoints vivem sob `/api/*` no `routes/web.php`.
- Todas as rotas de capacidade exigem usuário autenticado, e-mail verificado e organização ativa.

## Autenticação e autorização

- Middleware base: `auth`, `verified`, `hasOrg`.
- Regras de permissão adicionais por endpoint:
  - operações gerenciais exigem `admin` ou `maintainer`.
  - operações de disponibilidade podem ser restritas ao próprio usuário.

Para detalhes operacionais, veja **[Autenticação da API](/docs/integrations/api-authentication/)**.

## Endpoints disponíveis

### Disponibilidade de usuários

- `GET /api/availability`
- `POST /api/availability`
- `PUT /api/availability/{availability}`
- `DELETE /api/availability/{availability}`

### Feriados

- `GET /api/holidays`
- `POST /api/holidays`
- `PUT /api/holidays/{holiday}`
- `DELETE /api/holidays/{holiday}`

### Alocação por work item

- `GET /api/work-items/{workItem}/allocations`
- `POST /api/work-items/{workItem}/allocations`
- `PUT /api/work-items/{workItem}/allocations/{userId}`
- `DELETE /api/work-items/{workItem}/allocations/{userId}`

### Capacidade de sprint

- `GET /api/sprints/{sprint}/capacity`
- `GET /api/sprints/{sprint}/capacity/users`
- `GET /api/sprints/{sprint}/capacity/working-days`

### Reserva N1 por usuário

- `GET /api/sprints/{sprint}/n1-reservations`
- `PUT /api/sprints/{sprint}/n1-reservations/{user}`

### Vinculação com Jira

- `POST /api/jira/import`

Exemplo de payload:

```json
{
  "work_item_id": 123,
  "jira_key": "ENG-456",
  "remote_url": "https://sua-org.atlassian.net/browse/ENG-456"
}
```

## Códigos de resposta comuns

- `200`: consulta/atualização concluída
- `201`: recurso criado
- `204`: remoção sem conteúdo
- `403`: sem permissão
- `404`: recurso fora do escopo da organização/projeto
- `422`: erro de validação

## Estabilidade de contrato

Como essa API é evoluída junto ao frontend interno, trate o contrato como **acoplado à versão do deploy**.
Em integrações externas, valide payloads e códigos de erro a cada atualização de versão.
