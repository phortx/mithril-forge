---
title: Basic architecture
description: How Mithril Forge is structured and deployed.
---

- **Structure**: Monorepo with a React frontend, Kotlin Spring Boot backend, and Starlight documentation site.
- **Deployment**: Ships as a single executable JAR file.

## Build process

- Gradle uses Bun to compile the Vite frontend and Astro docs.
- Assets are copied to `backend/src/main/resources/static/`.
- Spring Boot `WebMvcConfig` routes API calls to Kotlin and forwards the rest to the React SPA.
- Railway deployments use `railpack.json` to install Bun before Gradle packages the JAR.

## Data strategy

- **Accounts**: Accounts exist for specific features, but they are optional. You can use the core encounter tracking without an account.
- **Active encounters**: Stored directly in the browser via `localStorage` and `usehooks-ts`. The DM and Player tabs sync locally via `storage` events (no WebSockets or BroadcastChannel).
- **Persistent data**: Stored in PostgreSQL (e.g., saved templates). The backend uses Flyway and JetBrains Exposed.

## Two views, one application

- The DM and Player views are different routes in the same React 19 application.
- **DM view**: Has access to all data, including exact hit points and full stat blocks.
- **Player view**: Filtered display for a TV or second monitor. Shows initiative, names, active turns, and timers. It never renders sensitive stat blocks or exact HP.
