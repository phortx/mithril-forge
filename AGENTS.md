# Agent Guidelines

Mithril Forge is a browser-based D&D encounter tracker designed for the tabletop. It manages initiative, HP, and conditions across two screens: a DM view (full control, stats) and a Player view (TV screen, limited info). No accounts, no installation, with active encounter state instantly synchronized locally via the browser.

## Tech Stack

- **React 19 / TypeScript 5 / Vite 8** - Frontend UI and component framework
- **Bun 1.3.13** - Frontend package manager and test runner
- **Tailwind CSS v4** - Styling
- **lucide-react** - Icons
- **Playwright** - End-to-end (E2E) testing
- **Kotlin 2.3.21 / Java GraalVM 24** - Backend language and runtime
- **Spring Boot 4.0.6** - Backend framework
- **PostgreSQL / Flyway / JetBrains Exposed** - Database, migrations, and ORM
- **Testcontainers** - Database testing
- **Starlight (Astro)** - Documentation site generator

## Common Commands

- `just dev` — Start backend and frontend local dev servers (Frontend proxy to :8080)
- `just check` — Run linting, type-checking, and tests for both frontend and backend
- `just test` — Run backend and frontend unit tests
- `just test-e2e` — Run Playwright E2E tests
- `just build` — Build the deployable Single-JAR (frontend bundled into backend)
- `just dev-docs` — Start Starlight documentation dev server

## Pre-Commit Verification

Before every commit, verify code quality on pending files:

```sh
just check
```

Never commit code that fails these checks.
**CRITICAL AI AGENT RULE**: You MUST run `just check` after making ANY code modifications to ensure you haven't broken the build, tests, or linting. Do not report completion to the user until `just check` passes.

## Code Style & Common Patterns

### Frontend
- Functional React components with hooks. Shared types in `src/types/`. One responsibility per component.
- Strict TS (`noUnusedLocals`, `noUnusedParameters`).
- Named exports only (except `App.tsx`).
- Co-locate tests (`Foo.test.tsx` next to `Foo.tsx`).
- Relative imports only. No barrel exports. No Prettier (ESLint only). **CRITICAL: English UI and texts only. Never use German or any other language.**
- Maintain high test coverage; always test new code.

### Backend
- Kotlin idioms (data classes, extension functions). Spring conventions (`@RestController`, `@Service`, `@Repository`).
- JetBrains Exposed/JDBC. Package: `de.entropylabs.mithrilforge`.
- Testcontainers for DB tests. Never modify DB by hand; use Flyway.

## File Organization

```text
/
├── backend/        # Spring Boot 4 / Kotlin backend
├── frontend/       # React 19 / Vite SPA
├── documentation/  # Starlight (Astro) documentation
└── assets/         # Shared assets (synced to public folders)
```

## Workflow

- **Monorepo:** React (Frontend) + Spring Boot (Backend).
- **Production Build:** Single JAR. `just build` (or `bootJar`) builds the Vite frontend and Astro documentation via Bun and embeds them in `backend/src/main/resources/static/` and `static/documentation/`. SPA routing via `WebMvcConfig`.
- **Deployment:** Deployed on Railway using `railpack.json`, which installs Bun before running the Gradle build.

## Gotchas

- **State Strategy:** Active encounter state syncs across browser tabs (DM/Player) using `usehooks-ts` `useLocalStorage` on `storage` events. **DO NOT** replace with BroadcastChannel/WebSockets. Persistent data (templates, etc.) stored in PostgreSQL.
- **Player vs DM View:** Same SPA. Player view ONLY shows initiative order, names, active turn, status, timer. Never show enemy HP, AC, or stat blocks to players.
- **Open5e:** Fetches monster data. Stat blocks only visible in DM view.

## Further Documentation

- [User Manual](documentation/src/content/docs/user-manual)
- [Technical Documentation](documentation/src/content/docs/technical-docs)
- [Development Setup](documentation/src/content/docs/technical-docs/how-to/development-setup.md)
