---
title: Deployment
description: How to deploy Mithril Forge.
---

You can deploy Mithril Forge anywhere that supports Java, Spring Boot, and PostgreSQL. It works out of the box on platforms like Railway.

### Environment variables

Set these variables for production:

**Core application**

- `APPLICATION_URL`: The public domain (like `mithril-forge.up.railway.app`). The app uses this for absolute links and emails.
- `SECRET`: A random string for session signing.

**Frontend and tracking (build time)**

The frontend builds together with the backend, so these must be present during the build step:

- `VITE_PUBLIC_POSTHOG_KEY`: The PostHog API key.
- `VITE_PUBLIC_POSTHOG_HOST`: The PostHog instance host (like `https://eu.i.posthog.com`). Tracking events go through the internal `/t` proxy to bypass ad blockers, but the app still needs this variable to load static assets.

**Database (PostgreSQL)**

- `SPRING_DATASOURCE_URL`: The JDBC URL (like `jdbc:postgresql://hostname:5432/dbname`).
- `SPRING_DATASOURCE_USERNAME`: Database username.
- `SPRING_DATASOURCE_PASSWORD`: Database password.

**Mail (SMTP)**

Used for sending emails:

- `SMTP_HOST`: The SMTP server (like `smtp.mailgun.org`).
- `SMTP_PORT`: The SMTP port (like `587`).
- `SMTP_USER`: SMTP username.
- `SMTP_PASSWORD`: SMTP password.
- `SMTP_FROM`: The sender address (like `noreply@yourdomain.com`).
- `SMTP_START_TLS`: Set to `true` to enable STARTTLS.

### Database migrations

The backend includes Flyway. Migrations run automatically when the app starts. If your database variables are correct, the app applies any pending scripts from `src/main/resources/db/migration` before the web server boots. You do not need to run migrations manually.

### Railway deployment example

1. Add a PostgreSQL service to your Railway project.
2. Link it to the Mithril Forge service.
3. Map Railway's variables to the Spring Boot properties:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}`
   - `SPRING_DATASOURCE_USERNAME=${{PGUSER}}`
   - `SPRING_DATASOURCE_PASSWORD=${{PGPASSWORD}}`
   - `APPLICATION_URL=${{RAILWAY_PUBLIC_DOMAIN}}`
4. Add your `SECRET` and any required `SMTP_*` variables.
