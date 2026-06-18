---
title: Testing Strategy
description: How we test the frontend, backend, and full application stack in Mithril Forge.
---

- Run `just check` before committing. It verifies types, runs the linter, and executes unit tests.

## Frontend

- **Runner**: Bun.
- **Location**: Co-located with components (e.g., `InitiativeList.test.tsx` next to `InitiativeList.tsx`).
- **Scope**: Isolated React components, utils, and hooks.
- **Command**: `just test`.

## Backend

- **Tools**: Spring Boot testing with Testcontainers.
- **Database**: Real PostgreSQL instance via Testcontainers, not H2.
- **Migrations**: Flyway applies schema changes before tests. Never modify the schema manually.

## End-to-end (E2E)

- **Runner**: Playwright.
- **Goal**: Verifies frontend and backend integration.
- **Key test**: Playwright opens multiple contexts to test `localStorage` sync between DM and Player views.
- **Command**: `just test-e2e`.
