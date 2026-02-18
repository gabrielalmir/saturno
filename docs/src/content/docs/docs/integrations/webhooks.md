---
title: Webhooks
description: Situação atual de webhooks e padrões seguros de integração.
---

## Estado atual

O Saturno possui suporte de configuração para frequência `webhook` nas integrações, mas **não expõe um endpoint público genérico de webhook** no estado atual.

Isso significa que, hoje, o fluxo padrão de integração é:

- configuração via tela de integrações
- sincronização manual ou por job
- uso da API interna autenticada para operações de vínculo e capacidade

## Quando você precisa receber eventos externos

Padrão recomendado:

1. Receber webhook em um serviço seu (gateway/integrador).
2. Validar assinatura/autenticidade do provedor externo.
3. Aplicar idempotência e retry controlado.
4. Encaminhar para Saturno de forma autenticada e auditável.

## Checklist de segurança

- segredo único por origem de webhook
- validação de assinatura e timestamp
- proteção contra replay
- logs de sucesso/falha por evento
