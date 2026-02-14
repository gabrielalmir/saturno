# Contributing

## Requisitos

- PHP 8.2+
- Composer 2+
- Node.js 18+

## Setup local

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
composer setup
composer dev
```

## Qualidade antes do PR

```bash
composer test
composer lint
npm run lint
npm run types
```

## Fluxo de Pull Request

1. Crie branch de feature ou correção.
2. Faça commits pequenos e descritivos.
3. Abra PR com contexto, motivação e impacto.
4. Garanta que os checks passaram.

## Diretrizes

- prefira mudanças pequenas e reversíveis
- mantenha consistência de estilo
- inclua testes quando alterar comportamento
