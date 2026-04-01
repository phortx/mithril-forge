import { useState } from 'react'
import type { Creature } from '../types/creature'

type CreatureListProps = {
  creatures: Creature[]
  onRemove: (id: string) => void
  onRollInitiative: (id: string) => void
  onRollAll: () => void
  onUpdateInitiative: (id: string, initiative: number | null) => void
}

function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

function InitiativeInput({
  creature,
  onUpdate,
}: {
  creature: Creature
  onUpdate: (id: string, initiative: number | null) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEdit = () => {
    setDraft(creature.initiative !== null ? String(creature.initiative) : '')
    setEditing(true)
  }

  const commit = () => {
    setEditing(false)
    const parsed = parseInt(draft, 10)
    onUpdate(creature.id, isNaN(parsed) ? null : parsed)
  }

  if (editing) {
    return (
      <input
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        autoFocus
        className="w-12 bg-gray-700 border border-gray-500 rounded px-1 py-0.5 text-center text-lg font-bold text-gray-100"
        aria-label={`Initiative for ${creature.name}`}
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      className="w-12 text-center text-lg font-bold text-gray-100 hover:bg-gray-700 rounded px-1 py-0.5"
      aria-label={`Edit initiative for ${creature.name}`}
    >
      {creature.initiative !== null ? creature.initiative : '—'}
    </button>
  )
}

export function CreatureList({
  creatures,
  onRemove,
  onRollInitiative,
  onRollAll,
  onUpdateInitiative,
}: CreatureListProps) {
  if (creatures.length === 0) {
    return <p className="text-gray-500 italic">No creatures added yet.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <button
          onClick={onRollAll}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
        >
          Roll All Initiative
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {creatures.map((creature) => (
          <li
            key={creature.id}
            className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded px-4 py-3"
          >
            <InitiativeInput
              creature={creature}
              onUpdate={onUpdateInitiative}
            />
            <button
              onClick={() => onRollInitiative(creature.id)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
            >
              Roll
            </button>
            <span className="text-gray-100 font-medium flex-1">
              {creature.name}
            </span>
            <span className="text-gray-400 text-sm">
              Init {formatModifier(creature.initiativeModifier)}
            </span>
            <button
              onClick={() => onRemove(creature.id)}
              className="text-gray-500 hover:text-red-400 transition-colors text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
