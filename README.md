# Saturno

**A flexible and intelligent sprint management tool designed for modern development teams.**

Saturno bridges the gap between high-level management oversight and day-to-day analyst workflows, providing role-based views that align with how different team members actually work.

---

## 🎯 Vision

Saturno was born from the need for a project management tool that:

- **For Managers**: Provides macro-level visibility across teams, sprints, and initiatives without drowning in operational details
- **For Analysts**: Offers a comfortable, Kanban-style workflow without bureaucratic overhead
- **For Everyone**: Integrates seamlessly with existing tools (JIRA, Trello) while remaining simple and self-hostable

Read more about the product vision in [`docs/IDEA.md`](./docs/IDEA.md).

---

## ✨ Key Features

### 🎨 Role-Based Views
- **Manager View**: Epic and story-level planning, cross-team metrics, capacity forecasting
- **Analyst View**: Task-level execution, personal Kanban boards, sprint-focused visibility

### 📊 Sprint Management
- Flexible sprint planning with L1/L2 work item prioritization
- Real-time capacity calculation considering holidays, absences, and work percentages
- Automatic carry-over of unfinished items to the next sprint
- WIP limits and bottleneck detection

### 🏢 Multi-Organization Support
- Create and manage multiple organizations and teams
- Team-based access control and permissions
- Cross-team visibility for managers

### 🔗 Integrations
- JIRA reference linking (import tickets as work items)
- Trello-compatible workflows
- Extensible integration framework

### 📈 Metrics & Insights
- Throughput tracking
- Cycle time analysis
- Capacity utilization
- Blocked item aging

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Database**: SQLite (default) / PostgreSQL
- **Authentication**: Laravel Fortify
- **Queue**: Laravel Queue

### Frontend
- **Framework**: React 19 with TypeScript
- **SSR**: Inertia.js 2.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI + shadcn/ui
- **Drag & Drop**: dnd-kit
- **Calendar**: react-big-calendar

### Development
- **Build Tool**: Vite 7
- **Testing**: Pest (PHP), Playwright (E2E)
- **Code Quality**: Laravel Pint, ESLint, Prettier

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite or PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gabrielalmir/saturno.git
   cd saturno
   ```

2. **Run the setup script**
   ```bash
   composer setup
   ```

   This will:
   - Install PHP dependencies
   - Create `.env` file from `.env.example`
   - Generate application key
   - Run database migrations
   - Install frontend dependencies
   - Build assets

3. **Start the development server**
   ```bash
   composer dev
   ```

   This starts:
   - Laravel development server (port 8000)
   - Queue worker
   - Log viewer (Pail)
   - Vite dev server (HMR)

4. **Access the application**
   ```
   http://localhost:8000
   ```

---

## 📖 Usage

### Creating Your First Organization

1. Register a new account
2. Create your first organization
3. Set up teams within the organization
4. Invite team members

### Planning a Sprint

1. Navigate to **Sprint Planning**
2. Define sprint dates and capacity
3. Add work items (L1/L2 tickets)
4. Assign work to team members
5. Start the sprint

### Managing Work Items

**As a Manager:**
- View epics and stories across all teams
- Track progress and bottlenecks
- Adjust capacity and priorities

**As an Analyst:**
- Use the Kanban board for daily work
- Update task status with drag-and-drop
- Log time and blockers

---

## 🧪 Testing

### Run PHP tests
```bash
composer test
```

### Run E2E tests
```bash
npm run test:e2e
```

### Run E2E tests with UI
```bash
npm run test:e2e:ui
```

---

## 🏗️ Development

### Code Style

**PHP:**
```bash
composer lint        # Auto-fix
composer test:lint   # Check only
```

**JavaScript/TypeScript:**
```bash
npm run lint         # Auto-fix
npm run format       # Format with Prettier
npm run format:check # Check only
```

### Type Checking
```bash
npm run types
```

### Database

Saturno uses SQLite by default for simplicity. To use PostgreSQL:

1. Update `.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=saturno
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

2. Run migrations:
   ```bash
   php artisan migrate --force
   ```

---

## 🐳 Self-Hosting with Docker

*(Coming soon)*

Saturno is designed to be easily self-hosted. Docker support is in development.

---

## 🔌 Integrations

### JIRA
Link existing JIRA tickets to Saturno work items. Configure in **Settings → Integrations**.

### Trello
Import boards and cards (planned).

### Custom Integrations
Saturno provides an extensible integration framework. Check the [API documentation](./docs/api.md) for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Make sure to run tests and linting before submitting.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [Laravel](https://laravel.com) - The PHP Framework for Web Artisans
- [Inertia.js](https://inertiajs.com) - The Modern Monolith
- [React](https://react.dev) - The library for web and native user interfaces
- [Tailwind CSS](https://tailwindcss.com) - Rapidly build modern websites
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/gabrielalmir/saturno/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gabrielalmir/saturno/discussions)

---

**Made with ❤️ for teams who value both strategic planning and tactical execution.**
