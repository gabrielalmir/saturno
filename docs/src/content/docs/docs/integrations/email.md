---
title: E-mail
description: Configuração de envio de e-mails transacionais.
---

Saturno suporta provedores SMTP e drivers de e-mail do framework.

## Exemplo SMTP

```ini
MAIL_MAILER=smtp
MAIL_HOST=smtp.seudominio.com
MAIL_PORT=587
MAIL_USERNAME=usuario
MAIL_PASSWORD=senha
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@seudominio.com
MAIL_FROM_NAME=Saturno
```

## Teste de entrega

Após configurar, execute um fluxo de convite ou notificação para validar envio.
