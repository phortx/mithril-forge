<div align="center">

# Mithril Forge

**D&D Encounter Tracker — Right in Your Browser**

Track initiative, HP, conditions, and more across two screens.\
One for the DM. One for the players. No install. No account. No cost.

[**Open Mithril Forge**](https://phortx.github.io/mithril-forge/) · [Report a Bug](https://github.com/phortx/mithril-forge/issues)

</div>

---

## Why Mithril Forge?

Managing initiative with paper cards gets unwieldy fast — especially in larger fights where you want to track HP, conditions, and stats properly. Mithril Forge replaces that with a browser-based tracker designed for the tabletop.

**Just open it and go.** There is nothing to install, no account to create, and no subscription to pay for. All data stays in your browser's local storage — private, instant, and entirely yours.

### How It Works

Open two browser windows on the same machine:

- **DM view** on your laptop — full stat blocks, HP, AC, all controls
- **Player view** on the TV — initiative order, names, conditions, active turn

State syncs between the windows automatically via localStorage. No backend, no server, no cloud.

---

## Features

### Initiative & Turns
- Add creatures manually (name, initiative modifier)
- Roll initiative or set it manually
- Sorted initiative order with the active turn highlighted
- Next Turn / Previous Turn, round counter, and round timer

### HP & Combat Tracking
- Current / Max HP with visual health bars
- Deal damage, heal, temporary HP
- Kill & Revive
- AC display (DM only)

### Creature Types
- **Player Characters** — full manual entry
- **Enemies** — full manual entry with stat block
- **Pets & Summons** — linked to an owner; configurable to share the owner's initiative or roll independently

### Conditions & Status
- Standard D&D condition tags (Blinded, Charmed, Frightened, ...)
- Concentration toggle with visual indicator
- Death status visible in Player view
- Token label field for miniature identification

### DM vs. Player View

| Feature | Player View | DM View |
|---|:---:|:---:|
| Initiative order | yes | yes |
| Names & Token labels | yes | yes |
| Conditions | yes | yes |
| Active turn / Round / Timer | yes | yes |
| Death status | yes | yes |
| HP & Health bars | — | yes |
| AC | — | yes |
| Stat blocks & Notes | — | yes |
| All controls | — | yes |

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
- [ ] AC display for DM
- [ ] Stat block input
- [ ] Kill / Revive
- [ ] Encounter reset / New encounter

### v0.3 — Conditions & Tracking
- [ ] Condition tags
- [ ] Concentration toggle with visual indicator
- [ ] Death status in Player view
- [ ] Token label field

### v0.4 — Pets, Summons & Polish
- [ ] Pets/Summons with owner linkage and shared initiative
- [ ] In-game elapsed time
- [ ] Notes field per creature (DM only)
- [ ] Keyboard shortcuts

### v0.5 — Extensions
- [ ] SRD monster database
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
