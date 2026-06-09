---
title: Deployment
description: How to deploy Mithril Forge.
---

You can deploy Mithril Forge to any platform capable of running Java/Spring Boot applications with a PostgreSQL database. It is pre-configured to easily deploy on platforms like Railway via Railway Buildpack.

### Environment Variables

To run the application in production, configure the following environment variables:

**Core Application**
- `APPLICATION_URL`: The public domain of your application (for example, `mithril-forge.up.railway.app`). This is used for generating absolute links and emails.
- `SECRET`: A secure, random string used for session signing and internal security.

**Database (PostgreSQL)**
- `SPRING_DATASOURCE_URL`: JDBC URL for your PostgreSQL database (for example, `jdbc:postgresql://hostname:5432/dbname`).
- `SPRING_DATASOURCE_USERNAME`: Database username.
- `SPRING_DATASOURCE_PASSWORD`: Database password.

**Mail (SMTP)**
Used for sending emails:
- `SMTP_HOST`: The SMTP server host (for example, `smtp.mailgun.org`).
- `SMTP_PORT`: The SMTP server port (for example, `587`).
- `SMTP_USER`: SMTP username.
- `SMTP_PASSWORD`: SMTP password.
- `SMTP_FROM`: The sender email address (for example, `noreply@yourdomain.com`).
- `SMTP_START_TLS`: Set to `true` to enable STARTTLS.

### Database Migrations

Flyway is integrated into the Spring Boot backend. Migrations execute automatically on application startup. As long as the database variables are set correctly, the app will connect and run any pending scripts from `src/main/resources/db/migration` before starting the web server. You do not need a manual migration step.

### Example: Railway Deployment

1. Add a **PostgreSQL** database service to your Railway project.
2. Link the PostgreSQL service to your Mithril Forge application service.
3. Map Railway's Postgres variables to Spring Boot properties:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}`
   - `SPRING_DATASOURCE_USERNAME=${{PGUSER}}`
   - `SPRING_DATASOURCE_PASSWORD=${{PGPASSWORD}}`
   - `APPLICATION_URL=${{RAILWAY_PUBLIC_DOMAIN}}`
4. Add your `APPLICATION_URL`, `SECRET`, and any required `SMTP_*` variables.
