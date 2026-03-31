# Mithril Forge — D&D Encounter Tracker

Web-based encounter tracker with two views: DM (full control) and Player (read-only for TV display). Hosted as a static site on GitHub Pages.

## Project Overview

A DM runs this on their MacBook with two browser windows: one for the DM view (local screen) and one for the Player view (TV via screen mirroring). State syncs between tabs via localStorage's native `storage` event — no backend, no polling.

## Tech Stack

- **Runtime/Build:** Bun
- **Framework:** React with TypeScript
- **Bundler:** Vite
- **State Sync:** `usehooks-ts` `useLocalStorage` hook (reactive cross-tab sync via `storage` event)
- **Deployment:** Static build artifact on GitHub Pages via GitHub Actions
- **Target:** Desktop/Landscape only (MacBook + TV)

## Architecture

### State Management
All encounter state lives in localStorage. The `useLocalStorage` hook from `usehooks-ts` handles persistence and cross-tab reactivity automatically. No BroadcastChannel, no custom sync logic.

### Views
A single app with a toggle to switch between DM and Player mode. Both views read from the same localStorage state. Only the DM view can write/modify state.

### Creature Types
- **Player Characters** — manual entry (name, HP, AC, stats)
- **Enemies** — manual entry with full stat block
- **Pets/Summons** — linked to an owner; configurable to use owner's initiative or roll their own

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server
bun run build        # Production build
bun run preview      # Preview production build
bun run lint         # Run linter
bun run typecheck    # Run TypeScript type checking
```

## Project Structure

```
src/
  components/       # React components
  hooks/            # Custom hooks (encounter state, etc.)
  types/            # TypeScript type definitions
  utils/            # Utility functions (dice rolling, sorting, etc.)
  App.tsx           # Root component with view toggle
  main.tsx          # Entry point
```

## Key Design Decisions

- **No backend.** Everything runs client-side. State persists in localStorage.
- **Cross-tab sync via storage event.** The `useLocalStorage` hook from `usehooks-ts` fires on `storage` events from other tabs. This is the only sync mechanism — do not add BroadcastChannel, polling, or WebSocket.
- **Player view hides sensitive data.** The Player view must never show enemy HP, AC, or stat blocks. Only show: initiative order, names, conditions, death status, active turn, round counter, and timer.
- **Conditions are display-only tags.** No automatic expiration or turn tracking for conditions.
- **English UI.** All user-facing text is in English.
- **Fantasy aesthetic.** Dark tones, parchment elements, thematic fonts. Design should evoke a tabletop RPG feel.

## Coding Conventions

- Use functional React components with hooks
- Define shared types in `src/types/`
- Keep components focused — one responsibility per component
- Use TypeScript strict mode
- Prefer named exports
- No default exports except for page-level components if needed by the router/framework

## Current Phase

**v0.1 — Proof of Concept.** Focus on:
1. Tech stack setup (Bun, React, TypeScript, Vite)
2. GitHub Actions + Pages deployment
3. Basic UI: add creatures, roll/set initiative, sorted order, active turn, next turn, round counter
4. localStorage persistence and cross-tab sync verification

Features NOT in scope yet: fantasy design, HP/AC tracking, conditions, concentration, pets/summons, stat blocks, monster database, D&D Beyond integration, mobile support.
