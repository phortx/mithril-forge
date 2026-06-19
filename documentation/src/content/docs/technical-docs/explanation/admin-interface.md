---
title: Admin Interface (Refine)
description: Technical overview of the Mithril Forge admin interface built with Refine.
---

# Admin Interface

Mithril Forge uses [Refine](https://refine.dev/) for its internal admin interface. This allows for rapid development of CRUD (Create, Read, Update, Delete) operations and management screens for administrative tasks.

## Why Refine?

Since the Mithril Forge backend uses **JetBrains Exposed** as its ORM, traditional Spring Boot admin generators (which usually rely heavily on Spring Data JPA/Hibernate) do not work out of the box.

Instead, we opted for a frontend-driven admin approach:

- **Headless UI:** Refine seamlessly integrates with our existing Tailwind CSS v4 setup.
- **React-Native:** It builds directly on top of our React 19 / Vite 8 stack.
- **Custom Backend Provider:** Refine communicates with standard REST endpoints that we expose specifically for administrative purposes via our Kotlin/Spring Boot backend.

## Integration Details

- **Location:** The admin interface is built as a separate route structure (typically under `/admin`) within the existing React SPA.
- **Authentication:** Access to the admin routes requires elevated privileges (Admin Role), verified via our standard authentication mechanism.
- **API Communication:** Data providers in Refine are configured to talk to specific `/api/admin/*` endpoints.

## Future Development

_Note: The admin interface is currently planned and the actual implementation will follow._
