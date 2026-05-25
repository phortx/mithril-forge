import { useEffect, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import type { Creature, CreatureType } from '../types/creature'
import { rollInitiative } from '../utils/rollInitiative'

export function useEncounter() {
  const [creatures, setCreatures] = useLocalStorage<Creature[]>(
    'mithril-forge-encounter',
    [],
  )

  // Migrate legacy data missing fields
  useEffect(() => {
    const needsMigration = creatures.some(
      (c) =>
        c.initiative === undefined ||
        c.creatureType === undefined ||
        c.maxHp === undefined ||
        c.ac === undefined ||
        c.monsterSlug === undefined,
    )
    if (needsMigration) {
      setCreatures((prev) =>
        prev.map((c) => ({
          ...c,
          initiative: c.initiative ?? null,
          creatureType: c.creatureType ?? 'enemy',
          maxHp: c.maxHp ?? 10,
          hp: c.hp ?? c.maxHp ?? 10,
          tempHp: c.tempHp ?? 0,
          ac: c.ac ?? 10,
          monsterSlug: c.monsterSlug ?? null,
        })),
      )
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sortedCreatures = useMemo(() => {
    const withInit = creatures.filter((c) => c.initiative !== null)
    const withoutInit = creatures.filter((c) => c.initiative === null)
    withInit.sort((a, b) => (b.initiative as number) - (a.initiative as number))
    return [...withInit, ...withoutInit]
  }, [creatures])

  const addCreature = (
    name: string,
    initiativeModifier: number,
    creatureType: CreatureType,
    maxHp: number,
    ac: number = 10,
    monsterSlug: string | null = null,
  ) => {
    setCreatures((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        initiativeModifier,
        initiative: null,
        creatureType,
        maxHp,
        hp: maxHp,
        tempHp: 0,
        ac,
        monsterSlug,
      },
    ])
  }

  const removeCreature = (id: string) => {
    setCreatures((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCreature = (
    id: string,
    updates: Partial<Omit<Creature, 'id'>>,
  ) => {
    setCreatures((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    )
  }

  const rollCreatureInitiative = (id: string) => {
    setCreatures((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, initiative: rollInitiative(c.initiativeModifier) }
          : c,
      ),
    )
  }

  const rollAllInitiative = () => {
    setCreatures((prev) =>
      prev.map((c) =>
        c.initiative === null
          ? { ...c, initiative: rollInitiative(c.initiativeModifier) }
          : c,
      ),
    )
  }

  const applyDamage = (id: string, amount: number) => {
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        let remaining = amount
        let newTempHp = c.tempHp
        if (newTempHp > 0) {
          const absorbed = Math.min(newTempHp, remaining)
          newTempHp -= absorbed
          remaining -= absorbed
        }
        return { ...c, tempHp: newTempHp, hp: Math.max(0, c.hp - remaining) }
      }),
    )
  }

  const applyHealing = (id: string, amount: number) => {
    setCreatures((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, hp: Math.min(c.maxHp, c.hp + amount) } : c,
      ),
    )
  }

  const setTempHp = (id: string, amount: number) => {
    setCreatures((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, tempHp: Math.max(c.tempHp, amount) } : c,
      ),
    )
  }

  const resetEncounter = () => {
    setCreatures([])
  }

  return {
    creatures: sortedCreatures,
    addCreature,
    removeCreature,
    updateCreature,
    rollCreatureInitiative,
    rollAllInitiative,
    applyDamage,
    applyHealing,
    setTempHp,
    resetEncounter,
  }
}
