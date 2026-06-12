# Mithril Forge — task runner
# Run `just` to see all available recipes.
#
# Required tooling: bun, ./gradlew, docker
# Postgres comes up automatically via Spring Boot Docker Compose Support on `bootRun`.

set shell := ["bash", "-cu"]

# Default: list all recipes
default:
    @just --list

# --- Development ---------------------------------------------------------

# Start backend + frontend in parallel (Postgres auto-managed by Spring Boot)
# Ctrl+C cleanly shuts down both processes via SIGTERM propagation.
dev: sync-assets
    #!/usr/bin/env bash
    set -euo pipefail
    trap 'echo "Shutting down..."; kill 0' EXIT INT TERM
    ./gradlew :backend:bootRun --console=plain &
    (cd frontend && bun run dev) &
    wait

# Backend only
dev-backend:
    ./gradlew :backend:bootRun

# Frontend only (assumes backend already on :8080)
dev-frontend:
    cd frontend && bun run dev

# --- Build ---------------------------------------------------------------

# Build the deployable Single-JAR (frontend bundled into backend)
build: sync-assets
    ./gradlew :backend:bootJar

# Clean build from scratch
build-clean:
    ./gradlew :backend:clean :backend:bootJar

# --- Testing -------------------------------------------------------------

# Run all tests (backend + frontend)
test: test-backend test-frontend

test-backend:
    ./gradlew :backend:test

test-frontend:
    cd frontend && bun run test

# Run End-to-End Tests via Playwright
test-e2e:
    cd frontend && bun run test:e2e

# Start backend + frontend with E2E Profile for isolated testing
test-e2e-stack:
    #!/usr/bin/env bash
    set -euo pipefail
    trap 'echo "Shutting down..."; kill 0' EXIT INT TERM
    ./gradlew :backend:bootRun --args='--spring.profiles.active=e2e' --console=plain &
    (cd frontend && VITE_BACKEND_URL=http://localhost:8081 bun run dev --port 5174) &
    wait

# --- Quality -------------------------------------------------------------

lint: lint-backend lint-frontend lint-docs

lint-backend:
    ./gradlew :backend:ktlintFormat

lint-frontend:
    cd frontend && bun run lint

lint-docs:
    cd documentation && bun run lint

format-docs:
    cd documentation && bun run format

typecheck: typecheck-frontend typecheck-docs

typecheck-frontend:
    cd frontend && bun run typecheck

typecheck-docs:
    cd documentation && bun run check

# Run everything CI checks locally
check: lint typecheck build-docs test test-e2e

# --- Database ------------------------------------------------------------

# Manually start the Postgres dev container (usually unnecessary — Spring
# Boot Docker Compose Support brings it up on `bootRun`).
db-up:
    docker compose up -d postgres

db-down:
    docker compose down

# Wipe volumes and restart fresh
db-reset:
    docker compose down -v
    docker compose up -d postgres

# --- Documentation -------------------------------------------------------

# Start the Starlight documentation dev server
dev-docs: sync-assets
    cd documentation && bun run dev

# Build the documentation for production
build-docs: sync-assets
    cd documentation && bun run build

# --- Assets --------------------------------------------------------------

# Sync shared assets to their respective application public folders
sync-assets:
    mkdir -p frontend/public documentation/public
    cp -r assets/* frontend/public/ 2>/dev/null || true
    cp -r assets/* documentation/public/ 2>/dev/null || true

# --- Utilities -----------------------------------------------------------

# Install dependencies for all projects
install: sync-assets
    cd frontend && bun install
    cd frontend && bun run test:e2e:install
    cd documentation && bun install
    ./gradlew --version

# Wipe everything build-related
clean:
    ./gradlew :backend:clean
    rm -rf frontend/dist frontend/node_modules frontend/.vite

# Run the built JAR locally to test the production bundle
run-jar: build
    java -jar backend/build/libs/backend-0.0.1-SNAPSHOT.jar
