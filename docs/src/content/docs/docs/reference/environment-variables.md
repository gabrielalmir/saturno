---
title: Variáveis de Ambiente
description: Variáveis essenciais para operar Saturno com previsibilidade.
---

Esta referência prioriza variáveis já utilizadas no projeto atual (`.env.example` + configs Laravel).

## Aplicação

| Variável | Exemplo | Observação |
|---|---|---|
| `APP_NAME` | `Saturno` | Nome exibido da aplicação |
| `APP_ENV` | `production` / `local` | Ambiente de execução |
| `APP_DEBUG` | `false` | Em produção, mantenha `false` |
| `APP_URL` | `http://localhost:8080` | URL base pública |
| `APP_KEY` | `base64:...` | Obrigatória para criptografia/session |
| `APP_PORT` | `8080` | Porta exposta pelo compose |
| `APP_FORCE_HTTPS` | `false` | Força geração de URLs HTTPS quando `true` |

## Banco de dados

| Variável | Exemplo | Observação |
|---|---|---|
| `DB_CONNECTION` | `pgsql` | Padrão recomendado |
| `DB_HOST` | `db` | No Docker Compose, host é `db` |
| `DB_PORT` | `5432` | Porta padrão PostgreSQL |
| `DB_DATABASE` | `saturno` | Nome do banco |
| `DB_USERNAME` | `saturno` | Usuário |
| `DB_PASSWORD` | `changeme` | Defina segredo forte em produção |
| `DB_SSLMODE` | `require` | Recomendado em ambiente externo |
| `DB_ENCRYPT` | `true` / `false` / `yes` / `no` | Opcional para SQL Server (`sqlsrv`) |
| `DB_TRUST_SERVER_CERTIFICATE` | `true` / `false` | Opcional para SQL Server (`sqlsrv`) |

## Fila, sessão e cache

| Variável | Exemplo | Observação |
|---|---|---|
| `QUEUE_CONNECTION` | `database` | Exige worker ativo |
| `SESSION_DRIVER` | `database` | Exige migrations de sessão |
| `CACHE_STORE` | `database` | Cache persistente no banco |

## E-mail

| Variável | Exemplo | Observação |
|---|---|---|
| `MAIL_MAILER` | `log` / `smtp` | `log` é padrão seguro para bootstrap |
| `MAIL_HOST` | `smtp.exemplo.com` | Para SMTP |
| `MAIL_PORT` | `587` | Porta SMTP |
| `MAIL_USERNAME` | `usuario` | Opcional conforme provedor |
| `MAIL_PASSWORD` | `senha` | Segredo |
| `MAIL_FROM_ADDRESS` | `no-reply@dominio.com` | Remetente |
| `MAIL_FROM_NAME` | `Saturno` | Nome do remetente |

## Após alterar variáveis

```bash
php artisan config:clear
php artisan cache:clear
```

Se a mudança afeta banco, rode migrations:

```bash
php artisan migrate --force
```
