---
title: State synchronization via localStorage
description: How Mithril Forge syncs the active encounter between the DM and Player views.
---

- **Mechanism**: The DM and Player views sync using the browser `localStorage` API and `usehooks-ts` `useLocalStorage`.
- **Flow**: The DM updates the state, the app writes it to local storage, and a `storage` event triggers an instant re-render in the Player tab.

## Why not WebSockets?

- **Local play**: Designed for in-room sessions on the same machine.
- **Offline support**: If the internet drops, combat tracking continues locally.
- **Simplicity**: No persistent backend connection needed.

## Why not BroadcastChannel?

- **Persistence**: `localStorage` retains the current state. If you accidentally close the Player tab, it reads the latest state instantly on reload. `BroadcastChannel` is ephemeral and requires explicit state requests.

## Implementation details

- **Library**: `usehooks-ts` handles all `storage` event listeners automatically.
- **Data access**: The DM view accesses all data. The Player view receives the same payload but strictly filters it, displaying only initiative order, names, active turns, conditions, and timers.
