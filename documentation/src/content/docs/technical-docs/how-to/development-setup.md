---
title: Development Setup
description: How to set up Mithril Forge for local development.
---

### Prerequisites

| Tool                                                | Version    |
| --------------------------------------------------- | ---------- |
| [Bun](https://bun.sh)                               | 1.3.13     |
| [Java (GraalVM Community)](https://www.graalvm.org) | 24         |
| [Docker](https://www.docker.com)                    | any recent |
| [just](https://github.com/casey/just)               | any recent |

We recommend using [mise](https://mise.jdx.dev) or [asdf](https://asdf-vm.com) with the `.tool-versions` file at the repo root to pin exact versions.

### Setup

```bash
just install    # bun install + verify gradlew
```

### Environment Variables

For frontend tracking (PostHog), the following environment variables need to be set in a `.env` file in the `frontend` directory, and provided during deployment:

| Variable                   | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `VITE_PUBLIC_POSTHOG_KEY`  | The public project API key from your PostHog project settings. |
| `VITE_PUBLIC_POSTHOG_HOST` | The PostHog instance host (e.g., `https://eu.i.posthog.com`).  |
