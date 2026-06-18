---
title: Encounter Tracking
description: How to add combatants and use the dual view system in Mithril Forge.
---

Mithril Forge tracks combat across two screens. You run the game from the DM view on your laptop and cast the Player view to a TV or second monitor.

## The dual view system

The application relies on cross-tab synchronization. You open the DM view in one tab and the Player view in another. When you update the encounter state on the DM screen, the Player view updates immediately through local browser storage. You do not need an account or a server connection.

| View            | Who uses it                | What they see                                                                                            |
| :-------------- | :------------------------- | :------------------------------------------------------------------------------------------------------- |
| **DM view**     | You, on a laptop or tablet | Full stat blocks, exact HP, Armor Class, hidden conditions, and full editing controls.                   |
| **Player view** | The party, cast to a TV    | Initiative order, names, active turn, visible conditions, and the turn timer. No numbers or stat blocks. |

## Adding combatants

You build encounters by adding creatures and party members to the list.

- **Custom characters:** Click the Add Custom button. You enter the name, max HP, and initiative modifier manually. Use this for player characters or unique NPCs.
- **Standard monsters:** Use the search bar. Mithril Forge integrates with Open5e for monster autocomplete. As you type a monster name, a dropdown shows matches. Select a monster to add it to the encounter, and the system pulls in its HP, AC, and full stat block automatically.

:::note
Monster stat blocks appear only in the DM view so you do not have to flip through rulebooks during combat.
:::

## Encounter controls

The toolbar at the top of the screen contains your primary encounter actions.

- **Start Encounter:** Begins combat and activates the first turn.
- **End Encounter:** Stops the timer and clears active turn indicators.
- **Reset:** Clears all combatants and empties the state so you can build the next fight.

For information on how to roll initiative and track hit points, read the [Combat & Turn Management](./combat-turn-management/) guide.
