# Mithril Forge — D&D Encounter Tracker

Web-based encounter tracker with two views: DM (full control) and Player (read-only for TV display). Hosted as a static site on GitHub Pages.

## Project Overview

A DM runs this on their MacBook with two browser windows: one for the DM view (local screen) and one for the Player view (TV via screen mirroring). State syncs between tabs via localStorage's native `storage` event — no backend, no polling.

## Tech Stack

- **Runtime/Build:** Bun
- **Framework:** React 19 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 with custom `@theme` block (fantasy color palette, fonts)
- **Icons:** lucide-react
- **State Sync:** `usehooks-ts` `useLocalStorage` hook (reactive cross-tab sync via `storage` event)
- **Testing:** Vitest + React Testing Library (`@testing-library/react`, `jest-dom`, `user-event`), jsdom environment
- **Monster Data:** Open5e SRD API (`src/api/open5e.ts`)
- **Deployment:** Static build artifact on GitHub Pages via GitHub Actions
- **Target:** Desktop/Landscape only (MacBook + TV)

## Architecture

### State Management
All encounter state lives in localStorage. The `useLocalStorage` hook from `usehooks-ts` handles persistence and cross-tab reactivity automatically. No BroadcastChannel, no custom sync logic.

Three hooks manage distinct state slices:
- `useEncounter` — creatures, persisted to `'mithril-forge-encounter'`
- `useTurnTracker` — active turn, round, persisted to `'mithril-forge-turn'`
- `useEncounterSettings` — stat visibility and other DM settings, persisted to `'mithril-forge-settings'`

### Views
A single app with a toggle to switch between DM and Player mode. Both views read from the same localStorage state. Only the DM view can write/modify state.

### Creature Types
- **Player Characters** — manual entry (name, HP, AC, initiative modifier)
- **Enemies** — manual entry or via Open5e monster search (auto-populates name, AC, HP, initiative modifier)
- **Pets/Summons** — not yet implemented

### Stat Visibility (DM-controlled)
The DM can set one of three modes for the Player view:
- `all` — all creatures' stats visible
- `party-only` — only party members' HP/AC visible (default)
- `hidden` — no stats visible in Player view

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server
bun run build        # Production build
bun run preview      # Preview production build
bun run lint         # Run linter
bun run typecheck    # Run TypeScript type checking
bun run test         # Run tests once
bun run test:watch   # Run tests in watch mode
```

## Project Structure

```
src/
  api/              # External API integrations (Open5e monster data)
  components/       # React components (co-located *.test.tsx files)
  hooks/            # Custom hooks (co-located *.test.ts files)
  types/            # TypeScript type definitions
  utils/            # Utility functions (co-located *.test.ts files)
  test/             # Test setup (setup.ts imports jest-dom matchers)
  App.tsx           # Root component with DM/Player view toggle
  main.tsx          # Entry point
  index.css         # Global styles: Tailwind import + custom fantasy theme
```

Root config files: `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`

## Key Design Decisions

- **No backend.** Everything runs client-side. State persists in localStorage.
- **Cross-tab sync via storage event.** The `useLocalStorage` hook from `usehooks-ts` fires on `storage` events from other tabs. This is the only sync mechanism — do not add BroadcastChannel, polling, or WebSocket.
- **Player view hides sensitive data.** The Player view must never show enemy HP, AC, or stat blocks. Only show: initiative order, names, death status, active turn, round counter, and timer. Stat visibility is DM-controlled via `StatVisibility` setting.
- **Conditions are display-only tags.** No automatic expiration or turn tracking for conditions.
- **English UI.** All user-facing text is in English.
- **Fantasy aesthetic.** Dark tones, parchment elements, thematic fonts (Cinzel, Cinzel Decorative, Crimson Pro). Implemented via Tailwind custom theme + CSS animations.
- **Open5e for monsters.** Enemy creatures can be looked up from the SRD via Open5e API. Stat blocks are only visible in DM view.
- **Relative imports only.** No path aliases, no barrel exports.

## Coding Conventions

- Use functional React components with hooks
- Define shared types in `src/types/`
- Keep components focused — one responsibility per component
- Use TypeScript strict mode (+ `noUnusedLocals`, `noUnusedParameters`)
- Prefer named exports; only `App.tsx` uses a default export
- Co-locate test files next to their source files (`Foo.test.tsx` beside `Foo.tsx`)
- No Prettier — formatting enforced by ESLint only

## Current Phase

**v0.2 — Core Features.** Implemented and working:
1. Tech stack setup (Bun, React, TypeScript, Vite, Tailwind CSS v4)
2. GitHub Actions + Pages deployment
3. Encounter UI: add creatures, roll/set initiative, sorted order, active turn, next turn, round counter
4. localStorage persistence and cross-tab sync
5. Full fantasy aesthetic (dark theme, liquid health orbs, animated glows, parchment panels)
6. HP/AC tracking: damage, healing, temp HP, color-coded liquid health bar
7. Stat blocks: StatBlockPanel with full Open5e SRD data (DM view only)
8. Monster database: Open5e search with autocomplete, auto-populates creature stats
9. Stat visibility control (all / party-only / hidden) for Player view
10. Test suite: Vitest + RTL covering hooks, components, utils, and API

Features NOT yet implemented: conditions, concentration, pets/summons with owner linking, D&D Beyond integration, mobile support.
