# Docker + SQL Server 2019+ (Guia de compatibilidade)

Este guia documenta a análise de compatibilidade e a configuração recomendada para executar o Saturno com **SQL Server 2019 ou superior** usando Docker.

## 1) Escopo da análise

A análise considerou:

- Driver Laravel `sqlsrv` em `config/database.php`
- Tipos de coluna usados nas migrations
- Imagem Docker com `msodbcsql18` + extensões `sqlsrv`/`pdo_sqlsrv`
- Orquestração com SQL Server 2019 em Compose

## 2) Resultado de compatibilidade

### Compatível com SQL Server 2019+

O projeto está compatível com SQL Server 2019+ para os principais recursos de banco utilizados:

- `foreignId`, `id`, `timestamps`, `text`, `boolean`, `date`, `dateTime`
- `json` (mapeado para `NVARCHAR(MAX)` no SQL Server)
- Índices simples e compostos
- Relacionamentos e regras de deleção

### Pontos de atenção

1. **JSON no SQL Server**
   - O SQL Server não possui tipo físico `JSON` como PostgreSQL.
   - O Laravel grava como texto (`NVARCHAR(MAX)`), mantendo a compatibilidade funcional.

2. **Criptografia TLS em conexão local**
   - Driver ODBC 18 força criptografia por padrão.
   - Para ambiente local/self-signed, usar `DB_TRUST_SERVER_CERTIFICATE=true`.

3. **Usuário e senha no container SQL Server**
   - O container oficial usa `SA_PASSWORD`.
   - Garanta senha forte e que atenda política do SQL Server.

4. **Versão de PHP para sqlsrv**
   - A imagem SQL Server usa PHP 8.4 por padrão por melhor maturidade prática do driver PECL (`sqlsrv`, `pdo_sqlsrv`) com SQL Server 2019+.

## 3) Arquivos de infraestrutura

- `Dockerfile.sqlserver`: build/runtime com Debian + ODBC 18 + extensões SQL Server
- `docker-compose.sqlserver.yml`: stack dedicada para SQL Server 2019

## 4) Como subir ambiente com SQL Server 2019+

## Pré-requisitos

- Docker + Docker Compose
- Arquivo `.env` configurado para SQL Server

### Exemplo mínimo de `.env`

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8080

DB_CONNECTION=sqlsrv
DB_HOST=db
DB_PORT=1433
DB_DATABASE=saturno
DB_USERNAME=sa
DB_PASSWORD=YourStrong!Passw0rd

DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
```

### Subir containers

```bash
docker compose -f docker-compose.sqlserver.yml up -d --build
```

### Rodar migrations

```bash
docker compose -f docker-compose.sqlserver.yml exec app php artisan migrate --force
```

### Validar extensões SQL Server no PHP

```bash
docker compose -f docker-compose.sqlserver.yml exec app php -m | rg "sqlsrv|pdo_sqlsrv"
```

## 5) Checklist de troubleshooting

- **Erro `Cannot open database "saturno"`**:
  - O SQL Server não cria o banco automaticamente.
  - O projeto inclui um serviço `db-init` no `docker-compose.sqlserver.yml` que resolve isso.
  - Se precisar criar manualmente: `docker compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -Q "CREATE DATABASE [saturno]"`
- Verifique se `DB_CONNECTION=sqlsrv`
- Verifique se `DB_HOST=db` no ambiente Docker
- Verifique se `SA_PASSWORD` e `DB_PASSWORD` são iguais
- Confirme `DB_TRUST_SERVER_CERTIFICATE=true` em ambiente local
- Confirme extensões com `php -m`

## 6) Produção (recomendação)

- Em produção com certificado válido, preferir:
  - `DB_ENCRYPT=true`
  - `DB_TRUST_SERVER_CERTIFICATE=false`
- Manter `msodbcsql18` atualizado
- Validar collation e timezone conforme padrão corporativo
