import { useState } from 'react'
import type { Creature } from '../types/creature'
import { Swords, Skull, ChevronRight } from 'lucide-react'

type CreatureListProps = {
  creatures: Creature[]
  activeCreatureId: string | null
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
        className="input-forge w-14 rounded px-1 py-0.5 text-center text-xl font-heading font-bold"
        aria-label={`Initiative for ${creature.name}`}
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      className="w-14 text-center text-xl font-bold font-heading text-forge-gold hover:bg-forge-brown rounded px-1 py-0.5 transition-colors"
      aria-label={`Edit initiative for ${creature.name}`}
    >
      {creature.initiative !== null ? creature.initiative : '—'}
    </button>
  )
}

export function CreatureList({
  creatures,
  activeCreatureId,
  onRemove,
  onRollInitiative,
  onUpdateInitiative,
}: CreatureListProps) {
  if (creatures.length === 0) {
    return <p className="text-forge-tan italic text-center">No creatures have entered the fray...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {creatures.map((creature) => {
          const isActive = creature.id === activeCreatureId
          return (
          <li
            key={creature.id}
            className={`flex items-center gap-4 rounded-lg px-5 py-4 ${
              isActive ? 'creature-card-active' : 'creature-card'
            }`}
          >
            <ChevronRight
              size={20}
              className={`shrink-0 ${isActive ? 'text-forge-gold' : 'invisible'}`}
              aria-label={isActive ? 'Active turn' : undefined}
            />
            <InitiativeInput
              creature={creature}
              onUpdate={onUpdateInitiative}
            />
            <button
              onClick={() => onRollInitiative(creature.id)}
              className="btn-ember shrink-0"
              aria-label={`Roll initiative for ${creature.name}`}
            >
              <Swords size={16} />
            </button>
            <span className="text-forge-parchment-light font-heading text-lg font-semibold flex-1">
              {creature.name}
            </span>
            <span className="text-forge-tan text-sm italic">
              {formatModifier(creature.initiativeModifier)}
            </span>
            <button
              onClick={() => onRemove(creature.id)}
              className="text-forge-tan hover:text-forge-burgundy-light transition-colors shrink-0"
              aria-label={`Remove ${creature.name}`}
            >
              <Skull size={16} />
            </button>
          </li>
          )
        })}
      </ul>
    </div>
  )
}
