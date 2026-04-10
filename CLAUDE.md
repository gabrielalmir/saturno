# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
composer setup      # First-time setup: install deps, .env, app key, migrations, npm build
composer dev        # Start all dev processes: Laravel server, queue worker, Pail log viewer, Vite HMR
composer dev:ssr    # Same as dev but with SSR enabled
```

### Testing
```bash
composer test           # Full suite: clear config + lint check + Pest
composer test:lint      # PHP lint check only (Pint --test)
composer lint           # Auto-fix PHP code style (Pint)
npm run test:e2e        # Playwright E2E tests (headless)
npm run test:e2e:ui     # Playwright with UI debugger
```

### Frontend
```bash
npm run build       # Vite production build
npm run build:ssr   # Vite SSR build
npm run lint        # ESLint auto-fix
npm run format      # Prettier auto-format (resources/)
npm run types       # TypeScript type check (tsc --noEmit)
```

### Docker
```bash
docker compose up -d --build                                  # PostgreSQL stack
docker compose -f docker-compose.sqlserver.yml up -d --build  # SQL Server stack
```

## Architecture

Saturno is a sprint management and capacity planning tool for agile teams. It uses a **monolithic Laravel 12 backend with a React 19 + TypeScript frontend** connected via **Inertia.js** (no separate REST API for internal consumption).

### Backend Structure

The backend follows a hybrid MVC + Domain-Driven Design pattern:

- **`app/Modules/WorkManagement/`** — The primary DDD module with three layers:
  - `Domain/` — Entities, value objects, domain exceptions (WorkItems, Sprints, Workflows, Tiers)
  - `Application/` — Services orchestrating domain logic
  - `Infrastructure/` — Repository implementations, persistence

- **`app/Models/`** — Eloquent models for all entities: Organization, Team, User, Sprint, WorkItem, Epic, Ticket, Board, BoardColumn, BoardItem, Holiday, UserAvailability, Integration

- **`app/Http/`** — Controllers, Middleware (including `hasOrg` for multi-tenancy enforcement), Form Requests

- **`app/Jobs/`** — Async queue jobs

- Multi-tenancy is enforced at the middleware level via Organizations and Teams.

### Frontend Structure

- **`resources/js/`** — All React/TypeScript source
  - `pages/` — Inertia page components (one per route)
  - `components/` — Shared UI components (shadcn/ui + Radix UI primitives)
  - `layouts/` — Layout wrappers (supports Manager vs Analyst role-based views)
  - `hooks/` — Custom React hooks
  - `types/` — TypeScript type definitions
  - `actions/` — Client-side action handlers

- Route generation uses **Wayfinder** (automatic Laravel → TypeScript route registration)
- Drag-and-drop via **dnd-kit**, calendar via **react-big-calendar**, animations via **Framer Motion**

### Data Flow

```
Laravel (Controller) → Inertia::render() → React Page Component
User action → Inertia form/router → Laravel Controller → Inertia response
```

Internal API routes (`/api/...`) exist for capacity, availability, allocations, and JIRA import.

### Key Domain Concepts

- **WorkItems** have a Status, Tier, and Workflow; WIP limits are enforced
- **Sprints** have a full lifecycle with events tracking
- **Capacity planning** includes holidays, user availability, N1 reservations, and allocations
- **Integrations** with JIRA, Todoist, and Trello are supported

### Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.4+, Laravel 12, Fortify auth |
| Frontend | React 19, TypeScript 5.7, Tailwind CSS 4 |
| Bridge | Inertia.js 2.0 |
| Build | Vite 7 |
| Testing (PHP) | Pest 4.3 + Pest Laravel plugin |
| Testing (E2E) | Playwright 1.58 + axe-core |
| Database | SQLite (dev), PostgreSQL or SQL Server (prod) |
| Queue | Laravel Queue (async jobs) |
