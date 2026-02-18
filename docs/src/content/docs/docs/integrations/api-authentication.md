---
title: Autenticação da API
description: Como autenticação e autorização funcionam nos endpoints internos do Saturno.
---

## Modelo atual

A API interna usa autenticação da aplicação web Laravel (sessão/cookie), não tokens públicos dedicados.

Na prática, os endpoints `/api/*` exigem:

- sessão autenticada (`auth`)
- e-mail verificado (`verified`)
- organização ativa (`hasOrg`)

## Implicações para integração

- Chamadas diretas sem sessão válida retornam redirecionamento/erro de autenticação.
- Parte dos endpoints exige papel `admin` ou `maintainer`.
- O escopo de dados é limitado à organização/projeto atual do usuário autenticado.

## Recomendações

- Para automações internas, prefira executar dentro do contexto autenticado da aplicação.
- Para integrações externas, use um backend intermediário seu para controlar credenciais e sessão.
- Não exponha cookies, segredos ou credenciais no frontend público.

## Boas práticas de segurança

- Rotacione credenciais operacionais periodicamente.
- Registre auditoria de ações críticas (sync, alterações de capacidade, reservas N1).
- Restrinja privilégios por função (`admin`, `maintainer`, `analyst`, `user`).
