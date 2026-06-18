---
title: Open5e API integration
description: How Mithril Forge fetches and handles monster data from the Open5e API.
sidebar:
  order: 4
---

- **Purpose**: Populates monster stat blocks and encounter data.

## Fetching and caching

- **Direct requests**: The frontend queries `api.open5e.com` directly. It bypasses the Kotlin backend.
- **Flow**: `MonsterAutocomplete` fetches matches. Selecting a monster triggers a second request for the full stat block.
- **Caching**: The frontend keeps an in-memory cache to stay under rate limits and prevent redundant network requests.

## Visibility

- **DM view only**: The Open5e API integration exclusively runs in the DM view.
- **Player view**: The full stat block exists in the local state, but the Player view only renders names, initiative order, active turns, conditions, and timers.

## Privacy

- The direct frontend request exposes the user's IP address to the Open5e servers. The privacy policy discloses this connection.
