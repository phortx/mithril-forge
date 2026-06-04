# Mithril Forge — D&D Encounter Tracker

Web-based encounter tracker with two views: DM (full control) and Player (read-only for TV display). Runs as a monorepo: React frontend + Spring Boot backend, served as a single JAR in production.

## Project Overview

A DM runs this on their MacBook with two browser windows: one for the DM view (local screen) and one for the Player view (TV via screen mirroring). Active encounter state syncs between tabs via localStorage. Persistent data (encounter templates, future features) is stored in PostgreSQL via the backend.

## Monorepo Structure

```
mithril-forge/
├── backend/                    # Spring Boot (Kotlin)
│   ├── build.gradle.kts
│   └── src/
│       ├── main/kotlin/de/entropy_labs/mithril_forge/
│       │   ├── MithrilForgeApplication.kt
│       │   ├── StatusController.kt
│       │   └── config/WebMvcConfig.kt
│       └── main/resources/
│           ├── application.yaml
│           └── static/         # gitignored — populated by bootJar build only
├── frontend/                   # React 19 + Vite + Bun
│   ├── src/
│   │   ├── api/               # Open5e + (future) backend API
│   │   ├── components/        # React components (co-located *.test.tsx)
│   │   ├── hooks/             # Custom hooks (co-located *.test.ts)
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions (co-located *.test.ts)
│   │   ├── test/              # Test setup (setup.ts)
│   │   ├── App.tsx            # Root component with DM/Player view toggle
│   │   └── main.tsx           # Entry point
│   ├── vite.config.ts         # Dev proxy: /api → :8080
│   ├── vitest.config.ts
│   ├── tsconfig.json, tsconfig.app.json, tsconfig.node.json
│   ├── eslint.config.js
│   └── package.json
├── gradle/wrapper/
├── gradlew, gradlew.bat
├── settings.gradle.kts         # include("backend")
├── compose.yaml                # Postgres (Docker)
├── justfile                    # Task runner (primary interface)
├── .tool-versions              # bun 1.3.13, java graalvm-community-24.0.1, kotlin 2.3.21
└── .github/workflows/ci.yml    # Lint + typecheck + tests + bootJar → JAR artifact
```

## Tech Stack

### Frontend
- **React 19** with TypeScript 5
- **Vite 8** (bundler + dev server)
- **Bun 1.3.13** (runtime + package manager)
- **Tailwind CSS v4** with custom `@theme` block (fantasy color palette, fonts)
- **lucide-react** (icons)
- **usehooks-ts** `useLocalStorage` (cross-tab reactive state via `storage` event)
- **Bun Test + React Testing Library** (`jest-dom`, `user-event`, Unit)
- **Playwright** (E2E tests with isolated DB/Mailpit via `test-e2e-stack`)
- **Open5e SRD API** (`src/api/open5e.ts`) for monster data

### Backend
- **Kotlin 2.3.21**, **Java GraalVM Community 24**
- **Spring Boot 4.0.6** (Web MVC, JDBC, Session JDBC, DevTools, Docker Compose Support)
- **PostgreSQL** database, **Flyway** migrations
- **JetBrains Exposed** and **Spring JDBC** for data access
- **SpringDoc OpenAPI 3** (Swagger UI at `/swagger-ui.html`)
- **Testcontainers** (PostgreSQL) for integration tests
- **Sentry** Spring Boot starter (currently disabled)

## Commands

### Primary: just (task runner)

```bash
just dev            # Backend + Frontend parallel (Postgres auto via Spring Boot Docker Compose)
just dev-backend    # Backend only (:8080)
just dev-frontend   # Frontend only (:5173, expects backend on :8080)

just build          # Single-JAR (frontend embedded in backend)
just build-clean    # clean + Single-JAR

just test           # All tests (backend + frontend)
just test-backend   # ./gradlew :backend:test (Testcontainers)
just test-frontend  # cd frontend && bun run test
just test-e2e       # Run End-to-End Tests via Playwright
just test-e2e-stack # Start backend + frontend with E2E Profile for isolated testing

just lint           # cd frontend && bun run lint
just typecheck      # cd frontend && bun run typecheck
just check          # lint + typecheck + test

just db-up          # Postgres container manually (usually unnecessary)
just db-down        # docker compose down
just db-reset       # Wipe volumes + restart

just install        # bun install + gradlew --version
just clean          # Remove backend/build/, frontend/dist/, frontend/node_modules/
just run-jar        # Build JAR + run locally (production smoke test)
```

### Frontend (from `frontend/`)

```bash
bun run dev         # Vite dev server with HMR
bun run build       # Production build
bun run preview     # Serve production build locally
bun run lint        # ESLint
bun run typecheck   # tsc --noEmit
bun run test        # Tests once
bun run test:watch  # Tests in watch mode
bun run test:e2e    # E2E tests
bun run test:e2e:ui # E2E tests with UI debugger
```

### Backend (from repo root)

```bash
./gradlew :backend:bootRun    # Start backend (dev, no frontend build)
./gradlew :backend:bootJar    # Single-JAR with embedded frontend
./gradlew :backend:test       # Backend tests (Testcontainers)
./gradlew :backend:clean      # Clean backend build artifacts
```

## Architecture

### State Strategy (Hybrid)

Active encounter state (creatures, initiative, HP, turns) lives in localStorage. The `useLocalStorage` hook from `usehooks-ts` handles persistence and cross-tab reactivity via `storage` events. Do not replace this with BroadcastChannel, polling, or WebSocket for encounter state.

Persistent data (encounter templates, future features) will be stored in PostgreSQL via the backend REST API.

Three frontend hooks manage distinct localStorage slices:
- `useEncounter` — creatures, persisted to `'mithril-forge-encounter'`
- `useTurnTracker` — active turn, round, persisted to `'mithril-forge-turn'`
- `useEncounterSettings` — stat visibility and DM settings, persisted to `'mithril-forge-settings'`

### Dev Proxy

Vite proxies `/api/*` → `http://localhost:8080` in dev. In production the frontend is served by Spring Boot from the same origin — no CORS is needed in either environment.

### SPA Routing

`WebMvcConfig.kt` forwards all paths without a dot (i.e. not asset files) to `index.html`, so React Router deep links work in the production JAR.

### Production Build

`bootJar` runs the Vite build first (via a Gradle task), copies `frontend/dist/` into `backend/src/main/resources/static/` (gitignored), then assembles the JAR. The result is a single self-contained JAR that serves both the API and the frontend.

### Views

A single app with a toggle to switch between DM and Player mode. Both views read from the same localStorage state. Only the DM view can write/modify state.

### Creature Types
- **Player Characters** — manual entry (name, HP, AC, initiative modifier)
- **Enemies** — manual entry or via Open5e monster search (auto-populates stats)
- **Pets/Summons** — not yet implemented

### Stat Visibility (DM-controlled)

The DM can set one of three modes for the Player view:
- `all` — all creatures' stats visible
- `party-only` — only party members' HP/AC visible (default)
- `hidden` — no stats visible in Player view

The Player view must never show enemy HP, AC, or stat blocks regardless of this setting.

## Coding Conventions

### Frontend
- Functional React components with hooks
- Shared types in `src/types/`
- One responsibility per component
- TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`)
- Named exports everywhere; only `App.tsx` uses a default export
- Co-locate test files next to their source (`Foo.test.tsx` beside `Foo.tsx`)
- Relative imports only — no path aliases, no barrel exports
- No Prettier — formatting enforced by ESLint only
- English UI — all user-facing text in English

### Backend
- Kotlin idioms: data classes, extension functions, functional style where it reads naturally
- Spring conventions: `@RestController`, `@Service`, `@Repository` layering
- Flyway for all schema changes — never modify the database by hand
- JetBrains Exposed and JDBC for data access
- Testcontainers for tests that need a real database
- Package structure: `de.entropylabs.mithrilforge`

### Quality Assurance & Testing
- **Zero Failures**: Always ensure that linting, typechecking, and all tests (`just check`) pass without any errors.
- **High Test Coverage**: Maintain and maximize test coverage. Always write tests for new components, hooks, utilities, and backend logic, and ensure existing test coverage is not reduced.

## Key Design Decisions

- **Cross-tab sync via storage event.** The `useLocalStorage` hook fires on `storage` events from other tabs. This is the only sync mechanism for active encounter state — do not add BroadcastChannel, polling, or WebSocket.
- **Player view hides sensitive data.** Only show: initiative order, names, death status, active turn, round counter, timer. Enemy HP, AC, stat blocks are always hidden from the Player view.
- **Conditions are display-only tags.** No automatic expiration or turn tracking for conditions.
- **Fantasy aesthetic.** Dark tones, parchment elements, thematic fonts (Cinzel, Cinzel Decorative, Crimson Pro). Implemented via Tailwind custom theme + CSS animations.
- **Open5e for monster data.** Enemy creatures can be looked up from the SRD via the Open5e API. Stat blocks are only visible in DM view.
- **No CORS needed.** Dev: Vite proxy. Production: same origin (Spring Boot serves frontend).
- **Target: Desktop/Landscape only.** MacBook + TV. No mobile support planned.

## Current Phase

**v0.4 — Backend Integration.** Implemented and working:
1. Monorepo structure (frontend/ + backend/)
2. Spring Boot 4.0.6 backend (Kotlin, PostgreSQL, Flyway)
3. Single-JAR production build (frontend embedded via bootJar)
4. Dev orchestration via justfile (parallel frontend + backend)
5. Vite dev proxy (/api → :8080)
6. SPA routing in production (WebMvcConfig)
7. CI: Lint + typecheck + FE tests + BE tests + bootJar → JAR artifact (no GitHub Pages)
8. All v0.1–v0.3 features intact: encounter UI, HP/AC tracking, Open5e search, stat blocks, test suite

**Next milestone:** Encounter Templates API — save/load named encounter configurations via backend REST endpoints and PostgreSQL.

Features NOT yet implemented: encounter templates, conditions, concentration, pets/summons with owner linking, D&D Beyond integration, mobile support.
