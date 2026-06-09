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
