---
title: Getting Started
description: First steps with Mithril Forge.
---

Managing initiative with paper cards gets unwieldy fast, especially in larger fights where you track HP, conditions, and stats. Mithril Forge replaces paper with a browser-based tracker designed for the tabletop.

**Just open it and go.** The hosted version is available at [Mithril Forge SaaS](https://mithril-forge.up.railway.app). You do not need to install anything, create an account, or pay a subscription. All encounter state stays in your browser's local storage. It is private, instant, and entirely yours.

### How It Works

Open two browser windows on the same machine:

- **DM view** on your laptop: full stat blocks, HP, and controls.
- **Player view** on the TV: initiative order, names, and active turn.

The active encounter state (creatures, initiative, HP, turns) syncs between the two windows automatically via localStorage. The backend stores encounter templates and persistent data in PostgreSQL.
