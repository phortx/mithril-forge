<div align="center">

# Mithril Forge

**D&D Encounter Tracker — Right in Your Browser**

Track initiative, HP, and more across two screens.\
One for the DM. One for the players. No install. No account. No cost.

[**Open Mithril Forge**](https://phortx.github.io/mithril-forge/) · [Report a Bug](https://github.com/phortx/mithril-forge/issues) · [Support on Ko-fi](https://ko-fi.com/phortx)

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

### Creature Management
- Add creatures manually (name, initiative modifier, max HP, AC)
- Add multiple creatures of the same type at once (e.g. 4 goblins)
- Inline creature type toggle (switch between Party/Enemy per creature)
- Kill and revive creatures

### Initiative & Turns
- Roll initiative individually or all at once
- Set initiative manually via inline editing
- Sorted initiative order with the active turn highlighted
- Floating Next Turn button, round counter, and in-game elapsed time (6s per round)
- Start / Reset / End encounter controls

### HP & Combat Tracking
- Current / Max HP with AC display
- Color-coded health bars (green → gold → red)
- Deal damage (absorbed by temp HP first), heal, set temporary HP
- HP visibility toggle: All HP, Party HP only, or No HP (controls what the Player view shows)

### SRD Monster Database
- Autocomplete search powered by the Open5e API when adding enemies
- Auto-fills name, initiative modifier (from DEX), max HP, and AC
- All auto-filled values are overridable before adding
- Full stat block side panel in DM view (AC, abilities, saves, actions, traits, and more)

### DM vs. Player View

| Feature | Player View | DM View |
|---|:---:|:---:|
| Initiative order | yes | yes |
| Names | yes | yes |
| Active turn / Round / Timer | yes | yes |
| Creature type badges | yes | yes |
| Death status | yes | yes |
| HP & Health bars | configurable | yes |
| AC | — | yes |
| Stat block side panel | — | yes |
| HP controls (damage/heal/temp) | — | yes |
| Kill / Revive | — | yes |
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
- [x] Fantasy design (dark tones, parchment, thematic fonts, animations, icons)
- [x] DM / Player view toggle
- [x] HP tracking (current/max, damage, heal, temp HP)
- [x] HP visibility toggle (all / party-only / none)
- [x] In-game elapsed time display
- [x] Creature type toggle (Party/Enemy inline)
- [x] AC tracking & display for DM
- [x] Kill / Revive with death status in Player view
- [x] Encounter reset / End encounter
- [x] Add multiple creatures of the same type at once
- [x] Test coverage

### v0.3 — SRD & Stat Blocks
- [x] SRD monster autocomplete via Open5e API
- [x] Auto-fill creature stats from SRD data
- [x] Stat block side panel (DM only)

### Future
- [ ] Condition tags
- [ ] Concentration toggle with visual indicator
- [ ] Pets/Summons with owner linkage and shared initiative
- [ ] Notes field per creature (DM only)
- [ ] Keyboard shortcuts
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
