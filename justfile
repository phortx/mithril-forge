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
dev:
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
build:
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

# --- Quality -------------------------------------------------------------

lint: lint-backend lint-frontend

lint-backend:
    ./gradlew :backend:ktlintFormat

lint-frontend:
    cd frontend && bun run lint

typecheck:
    cd frontend && bun run typecheck

# Run everything CI checks locally
check: lint typecheck test

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

# --- Utilities -----------------------------------------------------------

# Install dependencies for both sides
install:
    cd frontend && bun install
    ./gradlew --version

# Wipe everything build-related
clean:
    ./gradlew :backend:clean
    rm -rf frontend/dist frontend/node_modules frontend/.vite

# Run the built JAR locally to test the production bundle
run-jar: build
    java -jar backend/build/libs/backend-0.0.1-SNAPSHOT.jar
