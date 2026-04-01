<div align="center">

# Mithril Forge

**D&D Encounter Tracker — Right in Your Browser**

Track initiative, HP, and more across two screens.\
One for the DM. One for the players. No install. No account. No cost.

[**Open Mithril Forge**](https://phortx.github.io/mithril-forge/) · [Report a Bug](https://github.com/phortx/mithril-forge/issues)

</div>

---

## Why Mithril Forge?

Managing initiative with paper cards gets unwieldy fast — especially in larger fights where you want to track HP, conditions, and stats properly. Mithril Forge replaces that with a browser-based tracker designed for the tabletop.

**Just open it and go.** There is nothing to install, no account to create, and no subscription to pay for. All data stays in your browser's local storage — private, instant, and entirely yours.

### How It Works

Open two browser windows on the same machine:

- **DM view** on your laptop — full stat blocks, HP, all controls
- **Player view** on the TV — initiative order, names, active turn

State syncs between the windows automatically via localStorage. No backend, no server, no cloud.

---

## Features

### Initiative & Turns
- Add creatures manually (name, initiative modifier, max HP)
- Roll initiative individually or all at once
- Set initiative manually via inline editing
- Sorted initiative order with the active turn highlighted
- Next Turn, round counter, and in-game elapsed time (6s per round)
- Start / End encounter controls

### HP & Combat Tracking
- Current / Max HP with color-coded health bars (green → gold → red)
- Deal damage (absorbed by temp HP first), heal, set temporary HP
- HP visibility toggle: All HP, Party HP only, or No HP (controls what the Player view shows)

### Creature Types
- **Party** — manual entry
- **Enemy** — manual entry or SRD monster autocomplete
- Inline creature type toggle (switch between Party/Enemy per creature)

### SRD Monster Database
- Autocomplete search powered by the Open5e API when adding enemies
- Auto-fills name, initiative modifier (from DEX), and max HP
- All auto-filled values are overridable before adding
- Full stat block side panel in DM view (AC, abilities, saves, actions, traits, and more)

### DM vs. Player View

| Feature | Player View | DM View |
|---|:---:|:---:|
| Initiative order | yes | yes |
| Names | yes | yes |
| Active turn / Round / Timer | yes | yes |
| Creature type badges | yes | yes |
| HP & Health bars | configurable | yes |
| Stat block side panel | — | yes |
| HP controls (damage/heal/temp) | — | yes |
| Add/remove creatures | — | yes |
| Roll initiative | — | yes |
| Encounter controls | — | yes |

---

## Roadmap

### v0.1 — Proof of Concept
- [x] Tech stack setup (Bun, React, TypeScript, Vite)
- [x] GitHub Actions + Pages deployment
- [x] Add creatures, roll/set initiative, sorted order
- [x] Active turn highlight, Next Turn, round counter
- [x] localStorage persistence & cross-tab sync

### v0.2 — MVP
- [x] Fantasy design (dark tones, parchment, thematic fonts)
- [x] DM / Player view toggle
- [x] HP tracking (current/max, damage, heal, temp HP)
- [x] HP visibility toggle (all / party-only / none)
- [x] In-game elapsed time display
- [x] Creature type toggle (Party/Enemy inline)
- [ ] AC display for DM
- [ ] Kill / Revive
- [ ] Encounter reset / New encounter

### v0.3 — SRD & Stat Blocks
- [x] SRD monster autocomplete via Open5e API
- [x] Auto-fill creature stats from SRD data
- [x] Stat block side panel (DM only)

### v0.4 — Conditions & Tracking
- [ ] Condition tags
- [ ] Concentration toggle with visual indicator
- [ ] Death status in Player view
- [ ] Token label field

### v0.5 — Pets, Summons & Polish
- [ ] Pets/Summons with owner linkage and shared initiative
- [ ] Notes field per creature (DM only)
- [ ] Keyboard shortcuts

### v0.6 — Extensions
- [ ] D&D Beyond integration

---

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0

### Setup

```bash
bun install
```

### Commands

| Command | Description |
|---|---|
| `bun run dev` | Start local dev server with HMR |
| `bun run build` | Type-check + production build |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Run TypeScript type checker |

### Tech Stack

| | |
|---|---|
| Runtime | Bun |
| Framework | React 19 + TypeScript 5 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 |
| State sync | `useLocalStorage` from usehooks-ts |

---

## License

Licensed under the [GNU General Public License v3.0](LICENSE).
