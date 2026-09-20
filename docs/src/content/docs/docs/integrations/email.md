---
title: E-mail
description: Configuração de envio de e-mails no Saturno.
---

## Comportamento padrão

No `.env.example`, o projeto inicia com:

```ini
MAIL_MAILER=log
```

Esse modo evita envio real durante bootstrap e registra mensagens em log.

## Configuração SMTP (produção)

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

## Após alterar configuração

```bash
php artisan config:clear
php artisan cache:clear
```

## Validação recomendada

- Execute um fluxo real que dispara e-mail (ex.: convite/recuperação de conta).
- Confirme entrega no provedor SMTP.
- Monitore falhas de envio em logs e fila.
