import { useEffect, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import type { Creature } from '../types/creature'
import { rollInitiative } from '../utils/rollInitiative'

export function useEncounter() {
  const [creatures, setCreatures] = useLocalStorage<Creature[]>(
    'mithril-forge-encounter',
    [],
  )

  // Migrate legacy data missing the initiative field
  useEffect(() => {
    if (creatures.some((c) => c.initiative === undefined)) {
      setCreatures((prev) =>
        prev.map((c) => ({ ...c, initiative: c.initiative ?? null })),
      )
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sortedCreatures = useMemo(() => {
    const withInit = creatures.filter((c) => c.initiative !== null)
    const withoutInit = creatures.filter((c) => c.initiative === null)
    withInit.sort((a, b) => (b.initiative as number) - (a.initiative as number))
    return [...withInit, ...withoutInit]
  }, [creatures])

  const addCreature = (name: string, initiativeModifier: number) => {
    setCreatures((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, initiativeModifier, initiative: null },
    ])
  }

  const removeCreature = (id: string) => {
    setCreatures((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCreature = (
    id: string,
    updates: Partial<Pick<Creature, 'initiative'>>,
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

  return {
    creatures: sortedCreatures,
    addCreature,
    removeCreature,
    updateCreature,
    rollCreatureInitiative,
    rollAllInitiative,
  }
}
