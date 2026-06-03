<div align="center">

# Mithril Forge

**D&D Encounter Tracker — Right in Your Browser**

Track initiative, HP, and more across two screens.\
One for the DM. One for the players. No account. No cost.

[Report a Bug](https://github.com/phortx/mithril-forge/issues) · [Support on Ko-fi](https://ko-fi.com/phortx)

</div>

---

## Why Mithril Forge?

Managing initiative with paper cards gets unwieldy fast — especially in larger fights where you want to track HP, conditions, and stats properly. Mithril Forge replaces that with a browser-based tracker designed for the tabletop.

**Just open it and go.** There is nothing to install, no account to create, and no subscription to pay for. All encounter state stays in your browser's local storage — private, instant, and entirely yours.

### How It Works

Open two browser windows on the same machine:

- **DM view** on your laptop — full stat blocks, HP, all controls
- **Player view** on the TV — initiative order, names, active turn

The active encounter state (creatures, initiative, HP, turns) syncs between the two windows automatically via localStorage. Encounter templates and persistent data are stored in PostgreSQL via the backend.

---

## Features

### Creature Management
- Add creatures manually (name, initiative modifier, max HP, AC)
- Add multiple creatures of the same type at once (e.g. 4 goblins)
- Inline creature type toggle (switch between Party/Enemy per creature)
- Kill and revive creatures

### Initiative & Turns
- Roll initiative individually or all at once
- Set initiative manually via inline editing
- Sorted initiative order with the active turn highlighted
- Floating Next Turn button, round counter, and in-game elapsed time (6s per round)
- Start / Reset / End encounter controls

### HP & Combat Tracking
- Current / Max HP with AC display
- Color-coded health bars (green → gold → red)
- Deal damage (absorbed by temp HP first), heal, set temporary HP
- HP visibility toggle: All HP, Party HP only, or No HP (controls what the Player view shows)

### SRD Monster Database
- Autocomplete search powered by the Open5e API when adding enemies
- Auto-fills name, initiative modifier (from DEX), max HP, and AC
- All auto-filled values are overridable before adding
- Full stat block side panel in DM view (AC, abilities, saves, actions, traits, and more)

### DM vs. Player View

| Feature | Player View | DM View |
|---|:---:|:---:|
| Initiative order | yes | yes |
| Names | yes | yes |
| Active turn / Round / Timer | yes | yes |
| Creature type badges | yes | yes |
| Death status | yes | yes |
| HP & Health bars | configurable | yes |
| AC | — | yes |
| Stat block side panel | — | yes |
| HP controls (damage/heal/temp) | — | yes |
| Kill / Revive | — | yes |
| Add/remove creatures | — | yes |
| Roll initiative | — | yes |
| Encounter controls | — | yes |

---

## Roadmap

### v0.1 — Proof of Concept
- [x] Tech stack setup (Bun, React, TypeScript, Vite)
- [x] GitHub Actions CI
- [x] Add creatures, roll/set initiative, sorted order
- [x] Active turn highlight, Next Turn, round counter
- [x] localStorage persistence & cross-tab sync

### v0.2 — MVP
- [x] Fantasy design (dark tones, parchment, thematic fonts, animations, icons)
- [x] DM / Player view toggle
- [x] HP tracking (current/max, damage, heal, temp HP)
- [x] HP visibility toggle (all / party-only / none)
- [x] In-game elapsed time display
- [x] Creature type toggle (Party/Enemy inline)
- [x] AC tracking & display for DM
- [x] Kill / Revive with death status in Player view
- [x] Encounter reset / End encounter
- [x] Add multiple creatures of the same type at once
- [x] Test coverage

### v0.3 — SRD & Stat Blocks
- [x] SRD monster autocomplete via Open5e API
- [x] Auto-fill creature stats from SRD data
- [x] Stat block side panel (DM only)

### v0.4 — Backend Integration
- [x] Spring Boot backend (Kotlin, PostgreSQL)
- [x] Monorepo structure (frontend/ + backend/)
- [x] Single-JAR production build (frontend embedded in backend)
- [x] Dev orchestration via justfile (parallel frontend + backend)
- [x] Vite dev proxy (/api → :8080, no CORS needed)
- [x] SPA routing in production via WebMvcConfig

### Future
- [ ] Encounter templates (save/load via backend API)
- [ ] Condition tags
- [ ] Concentration toggle with visual indicator
- [ ] Pets/Summons with owner linkage and shared initiative
- [ ] Notes field per creature (DM only)
- [ ] Keyboard shortcuts
- [ ] D&D Beyond integration

---

## Development

### Prerequisites

| Tool | Version |
|---|---|
| [Bun](https://bun.sh) | 1.3.13 |
| [Java (GraalVM Community)](https://www.graalvm.org) | 24 |
| [Docker](https://www.docker.com) | any recent |
| [just](https://github.com/casey/just) | any recent |

Recommended: use [mise](https://mise.jdx.dev) or [asdf](https://asdf-vm.com) with the `.tool-versions` file at the repo root to pin exact versions.

### Setup

```bash
just install    # bun install + verify gradlew
```

### Commands

#### Via just (recommended)

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
| `just lint` | ESLint (frontend) |
| `just typecheck` | TypeScript type check (frontend) |
| `just check` | lint + typecheck + test |
| `just db-up` | Start Postgres container manually |
| `just db-down` | Stop Postgres container |
| `just db-reset` | Wipe volumes + restart Postgres |
| `just install` | Install all dependencies |
| `just clean` | Remove all build artifacts |
| `just run-jar` | Build + run JAR locally (production smoke test) |

#### Frontend (from `frontend/`)

| Command | Description |
|---|---|
| `bun run dev` | Vite dev server with HMR |
| `bun run build` | Production build |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript type checker |
| `bun run test` | Run tests once |
| `bun run test:watch` | Run tests in watch mode |

#### Backend (from repo root)

| Command | Description |
|---|---|
| `./gradlew :backend:bootRun` | Start backend (dev, no frontend build) |
| `./gradlew :backend:bootJar` | Build Single-JAR with embedded frontend |
| `./gradlew :backend:test` | Backend tests (Testcontainers) |
| `./gradlew :backend:clean` | Clean backend build artifacts |

### Tech Stack

**Frontend**

| | |
|---|---|
| Runtime | Bun 1.3.13 |
| Framework | React 19 + TypeScript 5 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 |
| State sync | `useLocalStorage` from usehooks-ts |
| Icons | lucide-react |
| Testing | Bun Test + React Testing Library + jest-dom + happy-dom |

**Backend**

| | |
|---|---|
| Language | Kotlin 2.3.21 |
| Runtime | Java GraalVM Community 24 |
| Framework | Spring Boot 4.0.6 |
| Database | PostgreSQL |
| Migrations | Flyway |
| Data access | Spring JDBC |
| API docs | SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`) |
| Testing | Testcontainers (PostgreSQL) |


### URLs
- http://localhost:5173/ - Frontend
- http://localhost:8080/swagger-ui/index.html - Swagger UI

## Deployment (Railway)

Mithril Forge is configured to be easily deployable on Railway via Railpack/Nixpacks.

### Database & Migrations

When deploying to Railway:
1. Add a **PostgreSQL** database service to your Railway project.
2. Link the PostgreSQL service to your Mithril Forge application service.
3. Set the following environment variables in your application service to map Railway's Postgres variables to Spring Boot properties:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}`
   - `SPRING_DATASOURCE_USERNAME=${PGUSER}`
   - `SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}`

**Flyway Migrations:**
Flyway is integrated into the Spring Boot backend. Migrations are executed **automatically on application startup**. No separate migration command or step is required in Railway. As long as the database variables are set correctly, the Spring Boot app will connect and run any pending scripts from `src/main/resources/db/migration` before starting the web server.

## License

Licensed under the [GNU General Public License v3.0](LICENSE).
