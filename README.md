<div align="center">

# Mithril Forge

**D&D Encounter Tracker — Right in Your Browser**

Track initiative, HP, and more across two screens.\
One for the DM. One for the players. No account. No cost.

[Mithril Forge SaaS](https://mithril-forge.up.railway.app) · [Report a Bug](https://github.com/phortx/mithril-forge/issues) · [Support on Ko-fi](https://ko-fi.com/phortx)

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
| `just test-e2e` | End-to-End tests via Playwright (starts isolated E2E stack) |
| `just test-e2e-stack` | Start backend + frontend with isolated E2E Postgres/Mailpit |
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
| `bun run test:e2e` | Playwright E2E tests |
| `bun run test:e2e:ui` | Playwright E2E tests in UI mode |

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
| Testing | Bun Test + RTL (Unit) + Playwright (E2E) |

**Backend**

| | |
|---|---|
| Language | Kotlin 2.3.21 |
| Runtime | Java GraalVM Community 24 |
| Framework | Spring Boot 4.0.6 |
| Database | PostgreSQL |
| Migrations | Flyway |
| Data access | JetBrains Exposed, Spring JDBC |
| API docs | SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`) |
| Testing | Testcontainers (PostgreSQL) |


### URLs
- http://localhost:5173/ - Frontend
- http://localhost:8080/swagger-ui/index.html - Swagger UI
- http://localhost:8025/ - Mailpit Web UI (Local Email Testing)

## Deployment

Mithril Forge can be deployed to any platform capable of running Java/Spring Boot applications with a PostgreSQL database. It is pre-configured to be easily deployable on platforms like Railway via Railway Buildpack.

### Environment Variables

To properly run the application in production, you need to configure the following environment variables:

**Core Application**
- `APPLICATION_URL`: The public domain of your application (e.g., `mithril-forge.up.railway.app`). Used for generating absolute links/emails.
- `SECRET`: A secure, random string used for session signing and internal security.

**Database (PostgreSQL)**
- `SPRING_DATASOURCE_URL`: JDBC URL for your PostgreSQL database (e.g., `jdbc:postgresql://hostname:5432/dbname`).
- `SPRING_DATASOURCE_USERNAME`: Database username.
- `SPRING_DATASOURCE_PASSWORD`: Database password.

**Mail (SMTP)**
Used for sending emails:
- `SMTP_HOST`: The SMTP server host (e.g., `smtp.mailgun.org`).
- `SMTP_PORT`: The SMTP server port (e.g., `587`).
- `SMTP_USER`: SMTP username.
- `SMTP_PASSWORD`: SMTP password.
- `SMTP_FROM`: The sender email address (e.g., `noreply@yourdomain.com`).
- `SMTP_START_TLS`: Set to `true` to enable STARTTLS.

### Database Migrations

Flyway is integrated into the Spring Boot backend. Migrations are executed **automatically on application startup**. As long as the database variables are set correctly, the app will connect and run any pending scripts from `src/main/resources/db/migration` before starting the web server. No manual migration step is required.

### Example: Railway Deployment

1. Add a **PostgreSQL** database service to your Railway project.
2. Link the PostgreSQL service to your Mithril Forge application service.
3. Map Railway's Postgres variables to Spring Boot properties:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}`
   - `SPRING_DATASOURCE_USERNAME=${{PGUSER}}`
   - `SPRING_DATASOURCE_PASSWORD=${{PGPASSWORD}}`
   - `APPLICATION_URL=${{RAILWAY_PUBLIC_DOMAIN}}`
4. Add your `APPLICATION_URL`, `SECRET`, and any required `SMTP_*` variables.

## License

Licensed under the [GNU General Public License v3.0](LICENSE).
