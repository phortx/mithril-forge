---
title: Tech Stack
description: Reference of the technologies used in Mithril Forge.
---

### Frontend

|            |                                          |
| ---------- | ---------------------------------------- |
| Runtime    | Bun 1.3.13                               |
| Framework  | React 19 + TypeScript 5                  |
| Bundler    | Vite 8                                   |
| Styling    | Tailwind CSS v4                          |
| State sync | `useLocalStorage` from usehooks-ts       |
| Icons      | lucide-react                             |
| Testing    | Bun Test + RTL (Unit) + Playwright (E2E) |

### Backend

|             |                                                      |
| ----------- | ---------------------------------------------------- |
| Language    | Kotlin 2.3.21                                        |
| Runtime     | Java GraalVM Community 24                            |
| Framework   | Spring Boot 4.0.6                                    |
| Database    | PostgreSQL                                           |
| Migrations  | Flyway                                               |
| Data access | JetBrains Exposed, Spring JDBC                       |
| API docs    | SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`) |
| Testing     | Testcontainers (PostgreSQL)                          |
