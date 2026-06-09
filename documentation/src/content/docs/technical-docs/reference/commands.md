---
title: CLI Commands
description: Reference list of available development commands.
---

### Via just (recommended)

| Command | Description |
|---|---|
| `just dev` | Start backend + frontend in parallel (Postgres auto-managed) |
| `just dev-backend` | Backend only on :8080 |
| `just dev-frontend` | Frontend only on :5173 (expects backend on :8080) |
| `just build` | Single-JAR build (frontend embedded in backend) |
| `just build-clean` | Clean + Single-JAR build |
| `just test` | All tests (backend + frontend) |
| `just test-backend` | Backend tests only (Testcontainers) |
| `just test-frontend` | Frontend tests only |
| `just test-e2e` | End-to-End tests via Playwright (starts isolated E2E stack) |
| `just test-e2e-stack` | Start backend + frontend with isolated E2E Postgres/Mailpit |
| `just dev-docs` | Start the local documentation dev server (Starlight) |
| `just build-docs` | Build the documentation for production |
| `just lint` | ESLint (frontend) |
| `just typecheck` | TypeScript type check (frontend) |
| `just check` | lint + typecheck + test |
| `just db-up` | Start Postgres container manually |
| `just db-down` | Stop Postgres container |
| `just db-reset` | Wipe volumes + restart Postgres |
| `just install` | Install all dependencies |
| `just clean` | Remove all build artifacts |
| `just run-jar` | Build + run JAR locally (production smoke test) |

### Frontend (from `frontend/`)

| Command | Description |
|---|---|
| `bun run dev` | Vite dev server with HMR |
| `bun run build` | Production build |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript type checker |
| `bun run test` | Run tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:e2e` | Playwright E2E tests |
| `bun run test:e2e:ui` | Playwright E2E tests in UI mode |

### Backend (from repo root)

| Command | Description |
|---|---|
| `./gradlew :backend:bootRun` | Start backend (dev, no frontend build) |
| `./gradlew :backend:bootJar` | Build Single-JAR with embedded frontend |
| `./gradlew :backend:test` | Backend tests (Testcontainers) |
| `./gradlew :backend:clean` | Clean backend build artifacts |
