import type { Creature } from '../types/creature'

type CreatureListProps = {
  creatures: Creature[]
  onRemove: (id: string) => void
}

function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function CreatureList({ creatures, onRemove }: CreatureListProps) {
  if (creatures.length === 0) {
    return <p className="text-gray-500 italic">No creatures added yet.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {creatures.map((creature) => (
        <li
          key={creature.id}
          className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded px-4 py-3"
        >
          <div className="flex items-center gap-4">
            <span className="text-gray-100 font-medium">{creature.name}</span>
            <span className="text-gray-400 text-sm">
              Init {formatModifier(creature.initiativeModifier)}
            </span>
          </div>
          <button
            onClick={() => onRemove(creature.id)}
            className="text-gray-500 hover:text-red-400 transition-colors text-sm"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
