---
title: Webhooks
description: Integração orientada a eventos com sistemas externos.
---

Webhooks permitem notificar sistemas terceiros quando eventos relevantes ocorrem.

## Casos comuns

- sincronização de status de item
- auditoria externa
- automações de comunicação

## Recomendação de segurança

- usar segredo por endpoint
- validar assinatura da requisição
- aplicar retry com idempotência no consumidor
