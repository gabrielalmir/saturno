---
title: Desenvolvimento
description: Ambiente de desenvolvimento e padrão de contribuição.
---

## Setup

```bash
git clone https://github.com/gabrielalmir/saturno.git
cd saturno
composer setup
composer dev
```

## Qualidade de código

```bash
composer lint
composer test:lint
npm run lint
npm run format:check
npm run types
```

## Fluxo de contribuição

1. criar branch de feature
2. implementar mudança com testes
3. abrir Pull Request com contexto técnico objetivo
