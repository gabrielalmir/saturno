---
title: Permissões
description: Papéis e regras de acesso usados no Saturno.
---

## Papéis de organização

| Papel | Escopo principal |
|---|---|
| `admin` | Controle total da organização, gestão de membros/papéis e operações críticas de governança |
| `maintainer` | Gestão operacional (sprints, integrações, capacidade), sem privilégios máximos de governança |
| `analyst` | Execução e operação diária, com permissões reduzidas para ações gerenciais |
| `user` | Acesso básico conforme associação a organização/projeto |

## Regras práticas observadas no backend

- Ações de planejamento e integrações geralmente exigem `admin` ou `maintainer`.
- Endpoints de capacidade validam escopo de organização e projeto do usuário.
- Em alguns fluxos, usuários sem papel gerencial só podem editar os próprios dados.

## Boas práticas

- adotar menor privilégio
- revisar acessos periodicamente
- garantir ao menos um `admin` por organização
- registrar ações sensíveis para auditoria
