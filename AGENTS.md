# Agent Guidelines

Mithril Forge is a browser-based D&D encounter tracker designed for the tabletop. It manages initiative, HP, and conditions across two screens: a DM view (full control, stats) and a Player view (TV screen, limited info). User management enables persistent storage of encounters, characters, and settings. No installation, with active encounter state instantly synchronized locally via the browser.

- **Production site:** https://www.mithril-forge.site
- **Repository:** https://github.com/phortx/mithril-forge
- **License:** GNU General Public License v3.0

## Tech Stack

### Frontend
- **React / TypeScript / Vite** - Frontend UI and component framework
- **Refine (@refinedev/core)** - Admin interface framework
- **react-router-dom** - Client-side routing
- **Tailwind CSS v4** - Styling
- **lucide-react** - Icons
- **react-hot-toast** - Toast notifications
- **recharts** - Charts
- **posthog-js** - Product analytics & tracking events
- **usehooks-ts** - React hooks (incl. `useLocalStorage` for cross-tab sync)
- **vanilla-cookieconsent** - Cookie consent banner

### Backend
- **Kotlin / Java GraalVM** - Backend language and runtime
- **Spring Boot** - Backend framework
- **JetBrains Exposed / JDBC** - ORM
- **PostgreSQL** - Database
- **Flyway** - Database migrations (auto-applied on startup from `backend/src/main/resources/db/migration`, `baseline-on-migrate: true`)
- **Spring Session JDBC** - HTTP sessions stored in PostgreSQL
- **Spring Security + java-jwt** - Authentication
- **springdoc-openapi** - API docs at `/v3/api-docs` and `/swagger-ui`
- **Sentry** - Backend error tracking (disabled by default; `sentry.enabled`)
- **Spring Boot Docker Compose Support** - Auto-starts Postgres + Mailpit on `bootRun`

### Infrastructure & Tooling
- **Bun** - Frontend package manager and test runner
- **Docker / Docker Compose** - Local infra (Postgres, Mailpit) — required for backend dev and tests
- **Mailpit** - Local SMTP capture (dev mail UI on `:8025`, SMTP on `:1025`)
- **Testcontainers** - Database testing (needs Docker running)
- **Playwright** - End-to-end (E2E) testing
- **ktlint** - Kotlin linter/formatter
- **ESLint** - Frontend linter (no Prettier)
- **Starlight (Astro)** - Documentation site generator
- **`just`** - Task runner (required host tool)

## Common Commands

### Development
- `just dev` — Start backend + frontend in parallel (Postgres auto-managed by Spring Boot Docker Compose). Frontend proxies to `:8080`.
- `just dev-backend` — Backend only (`./gradlew :backend:bootRun`)
- `just dev-frontend` — Frontend only (assumes backend already on `:8080`)
- `just dev-docs` — Start the Starlight documentation dev server

### Build
- `just build` — Build the deployable Single-JAR (frontend + docs bundled into backend)
- `just build-clean` — Clean build from scratch
- `just build-docs` — Build the Starlight documentation for production
- `just run-jar` — Build and run the JAR locally (`java -jar backend/build/libs/*.jar`)

### Testing
- `just test` — Run backend + frontend unit tests
- `just test-backend` — `./gradlew :backend:test` (requires Docker for Testcontainers)
- `just test-frontend` — `cd frontend && bun run test`
- `just test-e2e` — Run Playwright E2E tests (requires `bun run test:e2e:install` once)
- `just test-e2e-stack` — Start backend (e2e profile) + frontend in parallel for isolated E2E testing

### Quality
- `just check` — Run everything CI checks locally: `lint` + `typecheck` + `build-docs` + `test` + `test-e2e`
- `just lint` — Lint backend + frontend + docs
- `just lint-backend` — `./gradlew :backend:ktlintFormat`
- `just lint-frontend` — `cd frontend && bun run lint`
- `just lint-docs` — `cd documentation && bun run lint`
- `just format-docs` — `cd documentation && bun run format`
- `just typecheck` — Typecheck frontend + docs
- `just typecheck-frontend` — `cd frontend && bun run typecheck`
- `just typecheck-docs` — `cd documentation && bun run check`

### Database
- `just db-up` — Manually start the Postgres dev container (usually unnecessary — Spring Boot auto-starts it)
- `just db-down` — `docker compose down`
- `just db-reset` — Wipe volumes and restart fresh

### Utilities
- `just install` — Install dependencies for all projects (frontend, docs, Playwright browsers, Gradle)
- `just sync-assets` — Copy `assets/*` into `frontend/public/` and `documentation/public/` (auto-run by many recipes)
- `just clean` — Wipe everything build-related (backend build, frontend dist/node_modules/.vite)

## Pre-Commit Verification

Before every commit, verify code quality on pending files:

```sh
just check
```

Never commit code that fails these checks.
**CRITICAL AI AGENT RULE**: You MUST run `just check` after making ANY code modifications to ensure you haven't broken the build, tests, or linting. Do not report completion to the user until `just check` passes.

Note: `just check` includes `build-docs` and `test-e2e`, which require Docker running and Playwright browsers installed (`just install`).

## Code Style & Common Patterns

### Frontend
- Functional React components with hooks. Shared types in `src/types/`. One responsibility per component.
- Strict TS (`noUnusedLocals`, `noUnusedParameters`).
- Named exports only (except `App.tsx`).
- Co-locate tests (`Foo.test.tsx` next to `Foo.tsx`).
- Relative imports only. No barrel exports. No Prettier (ESLint only). **CRITICAL: English UI and texts only. Never use German or any other language.**
- Maintain high test coverage; always test new code.
- **Analytics & Tracking:** When adding new interactive features (buttons, forms, significant state changes), always implement tracking events using `posthog.capture('event_name', { properties })`. Tracking events go through the internal `/t` proxy to bypass ad blockers.
- **Tests use Bun's built-in test runner** (`bun test src/`) with `happy-dom` + `@testing-library/react`. Setup is preloaded via `frontend/bunfig.toml` → `src/test/setup.ts`. Do NOT reach for Jest or Vitest.

### Backend
- Kotlin idioms (data classes, extension functions). Spring conventions (`@RestController`, `@Service`, `@Repository`).
- JetBrains Exposed/JDBC. Package: `de.entropylabs.mithrilforge`.
- Testcontainers for DB tests (Docker must be running). Never modify DB by hand; use Flyway.

## File Organization

```text
/
├── backend/        # Spring Boot 4 / Kotlin backend
│   └── src/main/resources/db/migration/  # Flyway SQL migrations
├── frontend/       # React 19 / Vite SPA
│   └── src/
│       ├── admin/      # Refine admin interface
│       ├── api/        # API client
│       ├── components/ # React components (co-located tests)
│       ├── hooks/      # Custom hooks
│       ├── test/       # Test setup (setup.ts)
│       ├── types/      # Shared TypeScript types
│       └── utils/      # Utilities
├── documentation/  # Starlight (Astro) documentation
├── assets/         # Shared assets (synced to public folders via `just sync-assets`)
├── compose.yaml     # Dev infra (Postgres :5432, Mailpit UI :8025 / SMTP :1025)
├── compose-e2e.yaml  # E2E infra (Postgres :5433, Mailpit UI :8026 / SMTP :1026)
├── justfile         # Task runner recipes
├── railpack.json    # Railway deployment config (installs Bun before Gradle build)
└── .github/workflows/ci.yml  # CI pipeline
```

## Workflow

- **Monorepo:** React (Frontend) + Spring Boot (Backend) + Starlight (Docs).
- **Production Build:** Single JAR. `just build` (or `./gradlew :backend:bootJar`) builds the Vite frontend and Astro documentation via Bun and embeds them in `backend/src/main/resources/static/` and `static/documentation/`. SPA routing via `WebMvcConfig`.
- **Deployment:** Deployed on Railway using `railpack.json`, which installs Bun before running the Gradle build. Deployed at https://www.mithril-forge.site.
- **Asset Sync:** Many `just` recipes depend on `sync-assets`, which copies `assets/*` → `frontend/public/` and `documentation/public/`. Adding/removing an asset without re-syncing means it won't appear in dev or build output.

## CI/CD

CI runs on push and pull request to `main` (`.github/workflows/ci.yml`):
- Frontend: lint, typecheck, unit tests
- Documentation: lint, check, build
- Backend: `ktlintCheck`, unit tests (Testcontainers)
- E2E: Playwright tests (report uploaded as artifact)
- Build: `bootJar` (JAR uploaded as artifact on `main`)

Concurrency group `ci-${{ github.ref }}` cancels in-progress runs on new pushes.

## Development Ports & Proxy

| Service       | Dev Port | Notes                                                     |
|---------------|----------|-----------------------------------------------------------|
| Frontend SPA  | 5173     | Vite, `strictPort: true`                                  |
| Backend API   | 8080     | Spring Boot                                               |
| Postgres      | 5432     | via `compose.yaml`                                        |
| Mailpit UI    | 8025     | Web UI for captured mail                                  |
| Mailpit SMTP  | 1025     | Spring `spring.mail.host=localhost`                       |
| Swagger UI    | 8080     | `/swagger-ui` (proxied from frontend in dev)              |
| OpenAPI JSON  | 8080     | `/v3/api-docs` (proxied from frontend in dev)             |

**E2E profile** (`--spring.profiles.active=e2e`, used by `just test-e2e-stack`): backend `:8081`, frontend `:5174`, Postgres `:5433`, Mailpit UI `:8026` / SMTP `:1026`, uses `compose-e2e.yaml` and database `e2edatabase`.

Vite dev server proxies the following to `http://localhost:8080`:
- `/api` — App API
- `/v3/api-docs`, `/swagger-ui` — OpenAPI docs
- `/t` — Tracking proxy (PostHog)

## Gotchas

- **State Strategy:** Active encounter state syncs across browser tabs (DM/Player) using `usehooks-ts` `useLocalStorage` on `storage` events. **DO NOT** replace with BroadcastChannel/WebSockets. Persistent data (templates, etc.) stored in PostgreSQL.
- **Player vs DM View:** Same SPA. Player view ONLY shows initiative order, names, active turn, status, timer. Never show enemy HP, AC, or stat blocks to players.
- **Open5e:** Fetches monster data. Stat blocks only visible in DM view.
- **Docker required:** Backend dev (`just dev` / `just dev-backend`), backend tests (`just test-backend`), and `just check` all require Docker to be running because Testcontainers and Spring Boot Docker Compose Support need it.
- **Flyway auto-migrates on startup** — never apply SQL by hand; add a new migration script under `backend/src/main/resources/db/migration/`.
- **Spring Session JDBC** persists HTTP sessions in PostgreSQL — clearing cookies is not enough to reset sessions during testing.

## Further Documentation

- [User Manual](documentation/src/content/docs/user-manual)
- [Technical Documentation](documentation/src/content/docs/technical-docs)
  - [Basic Architecture](documentation/src/content/docs/technical-docs/explanation/basic-architecture.md)
  - [State Syncing (localStorage)](documentation/src/content/docs/technical-docs/explanation/localstorage-syncing.md)
  - [Open5e Integration](documentation/src/content/docs/technical-docs/explanation/open5e-integration.md)
  - [Testing Strategy](documentation/src/content/docs/technical-docs/explanation/testing-strategy.md)
  - [Auth, Cookies & Security](documentation/src/content/docs/technical-docs/explanation/tracking-and-cookies.md)
  - [Admin Interface (Refine)](documentation/src/content/docs/technical-docs/explanation/admin-interface.md)
- [Development Setup](documentation/src/content/docs/technical-docs/how-to/development-setup.md)
