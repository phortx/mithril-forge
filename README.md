# Mithril Forge

A web-based D&D encounter tracker with two views: a **DM view** for full control and a **Player view** for the TV at the table.

## The Idea

Managing initiative order with paper cards at the DM screen gets unwieldy fast — especially in larger fights where you want to track HP, conditions, and stats properly. Mithril Forge replaces that with a browser-based tracker that runs on two screens simultaneously:

- **DM view** on the MacBook: full stat blocks, HP, AC, all controls
- **Player view** on the TV: initiative order, names, conditions, active turn — no enemy stats

State syncs between the two browser windows via localStorage. No backend, no account required. Deployable as a static site.

## Features

### Initiative & Turns
- Add creatures manually (name, initiative modifier)
- Roll initiative or set it manually
- Sorted initiative order with the active turn highlighted
- Next Turn button, round counter, and timer

### Creature Types
- **Player Characters** — full manual entry
- **Enemies** — full manual entry with stat block
- **Pets & Summons** — linked to an owner; configurable to share the owner's initiative slot or roll their own

### HP & Combat Tracking
- Current / Max HP, deal damage, heal, temporary HP
- Kill & Revive
- AC display (DM only)

### Conditions & Status
- Standard condition tags (Blinded, Charmed, Frightened, etc.)
- Concentration toggle with visual indicator
- Death status visible in Player view
- Token label field ("A1", "Red", "Goblin #3")

### Views
| | Player View | DM View |
|---|---|---|
| Initiative order | ✓ | ✓ |
| Names | ✓ | ✓ |
| Conditions | ✓ | ✓ |
| Active turn / Round / Timer | ✓ | ✓ |
| HP | — | ✓ |
| AC | — | ✓ |
| Stat Blocks | — | ✓ |
| Notes | — | ✓ |
| All controls | — | ✓ |

## Roadmap

### v0.1 — Proof of Concept
- [x] Tech stack setup
- [x] GitHub Actions + Pages deployment
- [ ] Add creatures (name + initiative modifier)
- [ ] Roll or manually set initiative
- [ ] Sorted initiative order
- [ ] Active turn highlight + Next Turn button
- [ ] Round counter
- [ ] LocalStorage persistence & cross-tab sync

### v0.2 — MVP
- [ ] Fantasy design (dark tones, parchment, thematic fonts)
- [ ] DM / Player view toggle
- [ ] HP tracking (current/max, damage, heal, temp HP)
- [ ] AC display for DM
- [ ] Stat block input
- [ ] Kill / Revive
- [ ] Encounter reset / New encounter

### v0.3 — Conditions & Tracking
- [ ] Condition tags
- [ ] Conditions visible in Player view
- [ ] Concentration toggle with visual indicator
- [ ] Death status in Player view
- [ ] Token label field

### v0.4 — Pets, Summons & Polish
- [ ] Pets/Summons with owner linkage
- [ ] Configurable: shared or own initiative slot
- [ ] Indented display when sharing owner's slot
- [ ] In-game elapsed time
- [ ] Notes field per creature (DM only)
- [ ] Keyboard shortcuts

### v0.5 — Extensions
- [ ] SRD monster database
- [ ] D&D Beyond integration?

## Development

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0

### Setup

```bash
bun install
```

### Common tasks

| Command | Description |
|---|---|
| `bun run dev` | Start local dev server with HMR |
| `bun run build` | Type-check + production build into `dist/` |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | Run ESLint across the whole project |
| `bun run typecheck` | Run TypeScript compiler without emitting files |

### Tech Stack

| | |
|---|---|
| Runtime / Package manager | Bun |
| Framework | React 19 + TypeScript 5 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 |
| State persistence & sync | usehooks-ts `useLocalStorage` |

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
