# Mithril Forge

**Goal & Purpose:** A browser-based D&D encounter tracker designed for the tabletop. It manages initiative, HP, and conditions across two screens: a DM view (full control, stats) and a Player view (TV screen, limited info). No accounts, no installation, with active encounter state instantly synchronized locally via the browser.

**Architecture & Context:**
- **Monorepo:** React 19 (Frontend) + Spring Boot 4 (Backend).
- **Production Build:** Single JAR. `bootJar` builds Vite frontend and embeds it in `backend/src/main/resources/static/`. SPA routing via `WebMvcConfig`.
- **State Strategy:** Active encounter state syncs across browser tabs (DM/Player) using `usehooks-ts` `useLocalStorage` on `storage` events. **DO NOT** replace with BroadcastChannel/WebSockets. Persistent data (templates, etc.) stored in PostgreSQL.
- **Player vs DM View:** Same SPA. Player view ONLY shows initiative order, names, active turn, status, timer. Never show enemy HP, AC, or stat blocks to players.
- **Open5e:** Fetches monster data. Stat blocks only visible in DM view.

## Tech Stack
- **Frontend:** React 19, TypeScript 5, Vite 8, Bun 1.3.13, Tailwind CSS v4, `lucide-react`, React Testing Library, Playwright (E2E tests).
- **Backend:** Kotlin 2.3.21, Java GraalVM 24, Spring Boot 4.0.6, PostgreSQL, Flyway, JetBrains Exposed, SpringDoc OpenAPI, Testcontainers.
- **Docs:** Starlight (Astro) in `documentation/`.

## Key Commands (`just`)
- `just dev` / `dev-backend` / `dev-frontend`: Local dev servers (Frontend proxy to :8080).
- `just test` / `test-backend` / `test-frontend` / `test-e2e` / `test-e2e-stack`: Testing. E2E stack runs isolated DB/Mailpit.
- `just check`: Runs lint + typecheck + test. Must always pass with zero errors.
- `just build` / `run-jar`: Build / run production JAR.
- `just dev-docs` / `build-docs`: Start Starlight dev server / build docs.
- `just db-up` / `db-down` / `db-reset`: Manage PostgreSQL test/dev container.

## URLs & Environments
- **Frontend:** `http://localhost:5173`
- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **Mailpit:** `http://localhost:8025`
- **Docs Dev:** `http://localhost:4321`
- **Production Env Vars:** `APPLICATION_URL`, `SECRET`, `SPRING_DATASOURCE_*`, `SMTP_*`. (Flyway runs automatically on startup).

## Coding Conventions
### Frontend
- Functional React components with hooks. Shared types in `src/types/`. One responsibility per component.
- Strict TS (`noUnusedLocals`, `noUnusedParameters`).
- Named exports only (except `App.tsx`).
- Co-locate tests (`Foo.test.tsx` next to `Foo.tsx`).
- Relative imports only. No barrel exports. No Prettier (ESLint only). English UI only.
- Maintain high test coverage; always test new code.

### Backend
- Kotlin idioms (data classes, extension functions). Spring conventions (`@RestController`, `@Service`, `@Repository`).
- JetBrains Exposed/JDBC. Package: `de.entropylabs.mithrilforge`.
- Testcontainers for DB tests. Never modify DB by hand; use Flyway.

## Current Phase & Missing Features
- **Working:** Full Encounter UI, Open5e search, Spring Boot backend, E2E tests, Mailpit local email testing, documentation site.
- **Next:** Encounter Templates API (save/load configs to PostgreSQL).
- **Not Implemented:** Pets/summons with owners, concentration, D&D Beyond integration, mobile support.
