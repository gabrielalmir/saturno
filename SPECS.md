# Technical Specifications - Saturn Project

## 1. Overview
**Saturno** is a robust project management and productivity platform, inspired by agile methodologies (Scrum/Kanban). It was designed to offer a fluid user experience through a modern architecture that combines Laravel's productivity on the backend with React's reactivity on the frontend.

## 2. Technology Stack

### Backend
- **Language:** PHP 8.4+
- **Framework:** Laravel 12.0
- **Authentication:** Laravel Fortify (Session-based)
- **CLI Tools:** Laravel Pail (logs), Laravel Pint (linting), Laravel Tinker
- **Third-Party APIs:** Todoist PHP API, Trello PHP API

### Frontend
- **Framework:** React 19.0 (Inertia.js 2.0)
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Radix UI (accessibility), Lucide React (icons), Shadcn/UI (component base)
- **Animations:** Framer Motion (motion)
- **Interactivity:** @dnd-kit (drag and drop), React Big Calendar (scheduling)
- **Typing:** TypeScript 5.7+

### Database
- **Support:** SQLite (development/testing), MySQL/PostgreSQL (production), SQL Server (Docker support)
- **Migrations:** Native management via Laravel Migrations

### Infrastructure and DevOps
- **Containerization:** Docker & Docker Compose
- **Cloud/Deployment:** Fly.io (fly.toml)
- **Testing:** 
  - Backend: Pest PHP 4.3 (Feature & Unit)
  - E2E: Playwright 1.58+ with accessibility testing support (Axe)
- **Load Test:** Custom Node.js script for load and latency testing (`scripts/load-test.mjs`)

## 3. System Architecture
The project uses a hybrid approach between Laravel's classic MVC pattern and **Domain-Driven Design (DDD)** principles for complex modules.

- **Modules (`app/Modules`):** Encapsulamento of complex business logic (e.g., `WorkManagement`).
  - **Domain:** Entities, Value Objects, Domain Services, and Exceptions.
  - **Application:** Services that orchestrate domain logic for specific use cases.
  - **Infrastructure:** Concrete implementations of repositories and persistence integration.
- **Inertia.js:** Acts as the bridge between Laravel and React, allowing a SPA experience without the need to build a separate complex JSON API for internal consumption.
- **Multi-tenancy:** Implementation based on `Organizations` and `Teams`, with verification middleware (`hasOrg`).

## 4. Detailed Features

### 4.1 Work Management
- **Work Items:** Support for different item types (Stories, Tasks, Bugs, etc.).
- **Epics & Tickets:** Hierarchical structuring for macro and micro views.
- **Boards:** Highly interactive Kanban boards with customizable columns and drag-and-drop sorting.

### 4.2 Planning and Sprints
- **Sprint Planning:** Tools to organize the backlog into sprints.
- **Lifecycle:** Features to Start, Monitor, and Complete Sprints.
- **Events:** Tracking of sprint and work item events for auditing and metrics.

### 4.3 Capacity Management
- **User Availability:** Definition of individual team member availability.
- **Holidays:** Registry of holidays impacting planning.
- **N1 Reservations:** Capacity reservation for support or recurring tasks.
- **Work Item Allocation:** Detailed hour/effort allocation per work item.

### 4.4 Integrations
- **Todoist/Trello:** Synchronization and linking of external tasks.
- **Jira Import:** Import of work items directly from Jira via API.
- **Sync Logs:** Detailed audit of synchronization processes.

## 5. Relevant Directory Structure
- `app/Actions`: Granular actions, mainly for authentication (Fortify).
- `app/Modules/WorkManagement`: The heart of the work management business logic.
- `resources/js/Pages`: React components representing application pages.
- `resources/js/Components`: Reusable UI components.
- `database/migrations`: Database structure definition.
- `scripts/`: Utilities such as image background removal (`remove_background.py`) and load tests.
- `docs/`: Full technical documentation built with Astro/Starlight.

## 6. Development Workflow

### Initial Setup
1. Run `composer run setup` (installs dependencies, generates keys, runs migrations).
2. Configure the `.env` file with the necessary credentials.

### Common Commands
- `npm run dev`: Starts Vite and the development server.
- `php artisan test`: Runs the Pest test suite.
- `npm run test:e2e`: Runs interface tests with Playwright (headless).
- `npm run test:e2e:ui`: Opens the Playwright visual interface for debugging.
- `npm run test:e2e:headed`: Runs interface tests with a visible browser.
- `composer run lint`: Formats PHP code via Laravel Pint.

## 7. Security Considerations
- Native CSRF protection via Laravel.
- Input sanitization and SQL Injection protection via Eloquent ORM.
- Robust authorization middleware to ensure isolation between organizations.
- Audit logs for critical actions and synchronizations.

## 8. Testing Strategy

### 8.1 Backend (Pest PHP)
The project uses **Pest PHP** for a more expressive and modern testing experience.
- **Unit Tests (`tests/Unit`):** Focused on pure business logic, without external dependencies or database access.
- **Feature Tests (`tests/Feature`):**
  - **HTTP/API:** Validation of routes, middlewares, controllers, and JSON responses.
  - **Authorization & Multi-tenancy:**
    - Blocking cross-organization access for holidays, availabilities, allocations, and sprints.
    - Role-based access control (RBAC): Admin vs. Maintainer vs. User.
    - Restriction of integration configurations and member management to managers only.
  - **Work Item Governance:**
    - Validation of WIP (Work In Progress) limits in active sprints.
    - Status transition rules (e.g., preventing a direct jump from 'Backlog' to 'Completed').
    - Maintenance of integrity and sorting (position) in board movements.
  - **Database State:** Use of the `RefreshDatabase` trait to ensure each test runs in a clean and isolated environment.
- **Custom Expectations:** Pest extensions for domain-specific assertions (e.g., `expect($user)->toBeInOrganization($org)`).

### 8.2 Frontend & E2E (Playwright)
The interface layer and critical user flows are validated via **Playwright**.
- **Critical Flows and UI:**
  - Presence of branding, logo, and essential navigation elements.
  - Link integrity and 404 error prevention on detail pages.
  - Correct display of status badges and visual indicators.
- **Sprint Board:**
  - Rendering of columns (Backlog, Ready, In Progress, Blocked, Completed).
  - Real-time search and filter functionality.
  - Keyboard shortcuts and visual hints (tooltips/kbd).
  - **Complex Interactions:** Validation of Drag and Drop between columns with visual feedback.
- **Accessibility (Axe):** Integrated automated tests to ensure compliance with WCAG standards via `@axe-core/playwright`.
- **Multi-tenancy E2E:** Tests simulating users from different organizations to ensure private data never leaks between sessions.

### 8.3 Load and Performance Testing
- **Custom Runner (`scripts/load-test.mjs`):** Node.js script simulating multiple virtual users (VUs) accessing critical endpoints.
- **Metrics:** Collection of latency data (p50, p95, p99), requests per second (RPS), and success/failure rates.
- **Stress Test:** Used to validate system scalability in high-demand scenarios.
