---
title: Variáveis de Ambiente
description: Variáveis essenciais para configurar o Saturno.
---

## Aplicação

| Variável | Exemplo | Descrição |
|---|---|---|
| `APP_NAME` | `Saturno` | Nome da aplicação |
| `APP_ENV` | `production` | Ambiente de execução |
| `APP_DEBUG` | `false` | Exibição de erros detalhados |
| `APP_URL` | `https://saturno.exemplo.com` | URL pública |
| `APP_KEY` | `base64:...` | Chave de criptografia |

## Banco

| Variável | Exemplo | Descrição |
|---|---|---|
| `DB_CONNECTION` | `pgsql` | Driver do banco |
| `DB_HOST` | `db` | Host do banco |
| `DB_PORT` | `5432` | Porta do banco |
| `DB_DATABASE` | `saturno` | Nome do banco |
| `DB_USERNAME` | `saturno` | Usuário |
| `DB_PASSWORD` | `changeme` | Senha |

## Filas e e-mail

| Variável | Exemplo | Descrição |
|---|---|---|
| `QUEUE_CONNECTION` | `database` | Driver de filas |
| `MAIL_MAILER` | `smtp` | Driver de e-mail |
| `MAIL_HOST` | `smtp.exemplo.com` | Host SMTP |
