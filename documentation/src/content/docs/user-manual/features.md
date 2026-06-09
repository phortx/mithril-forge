---
title: Features & Interface
description: Overview of Mithril Forge features and the difference between DM and Player views.
---

## Core capabilities

### Creature Management
- Add creatures manually (name, initiative modifier, max HP, AC).
- Add multiple creatures of the same type at once (for example, 4 goblins).
- Toggle creature types inline to switch between Party and Enemy.
- Kill and revive creatures.

### Initiative and Turns
- Roll initiative individually or all at once.
- Set initiative manually via inline editing.
- View the sorted initiative order with the active turn highlighted.
- Use the floating Next Turn button, view the round counter, and track in-game elapsed time (6 seconds per round).
- Start, reset, or end encounters.

### HP and Combat Tracking
- Display Current and Max HP alongside AC.
- View color-coded health bars (green to gold to red).
- Deal damage (absorbed by temporary HP first), heal, or set temporary HP.
- Toggle HP visibility: All HP, Party HP only, or No HP. This setting controls what the Player view shows.

### SRD Monster Database
- Search for enemies using autocomplete powered by the Open5e API.
- Auto-fill names, initiative modifiers (based on DEX), max HP, and AC.
- Override any auto-filled values before adding the creature.
- Access a full stat block side panel in the DM view, which includes AC, abilities, saves, actions, and traits.

## DM vs. Player View

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
