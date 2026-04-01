import { useLocalStorage } from 'usehooks-ts'
import type { Creature } from '../types/creature'

export function useEncounter() {
  const [creatures, setCreatures] = useLocalStorage<Creature[]>(
    'mithril-forge-encounter',
    [],
  )

  const addCreature = (name: string, initiativeModifier: number) => {
    setCreatures((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, initiativeModifier },
    ])
  }

  const removeCreature = (id: string) => {
    setCreatures((prev) => prev.filter((c) => c.id !== id))
  }

  return { creatures, addCreature, removeCreature }
}
