import { useState } from 'react'
import type { Creature } from '../types/creature'
import type { HpVisibility } from '../types/encounterSettings'
import type { ViewMode } from '../types/viewMode'
import { Swords, Skull, ChevronRight, BookOpen } from 'lucide-react'
import { HealthBar } from './HealthBar'
import { HpControls } from './HpControls'

type CreatureListProps = {
  creatures: Creature[]
  activeCreatureId: string | null
  readOnly?: boolean
  viewMode: ViewMode
  hpVisibility: HpVisibility
  onRemove: (id: string) => void
  onRollInitiative: (id: string) => void
  onRollAll: () => void
  onUpdateInitiative: (id: string, initiative: number | null) => void
  onToggleCreatureType: (id: string) => void
  onDamage: (id: string, amount: number) => void
  onHeal: (id: string, amount: number) => void
  onSetTempHp: (id: string, amount: number) => void
  onShowStatBlock?: (monsterSlug: string) => void
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

function shouldShowHp(
  viewMode: ViewMode,
  hpVisibility: HpVisibility,
  creature: Creature,
): boolean {
  if (viewMode === 'dm') return true
  if (hpVisibility === 'all') return true
  if (hpVisibility === 'party-only') return creature.creatureType === 'party'
  return false
}

export function CreatureList({
  creatures,
  activeCreatureId,
  readOnly = false,
  viewMode,
  hpVisibility,
  onRemove,
  onRollInitiative,
  onUpdateInitiative,
  onToggleCreatureType,
  onDamage,
  onHeal,
  onSetTempHp,
  onShowStatBlock,
}: CreatureListProps) {
  if (creatures.length === 0) {
    return <p className="text-forge-tan italic text-center">No creatures have entered the fray...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {creatures.map((creature) => {
          const isActive = creature.id === activeCreatureId
          const showHp = shouldShowHp(viewMode, hpVisibility, creature)
          return (
          <li
            key={creature.id}
            className="relative"
          >
            <ChevronRight
              size={20}
              className={`absolute -left-7 top-5 ${isActive ? 'text-forge-gold' : 'invisible'}`}
              aria-label={isActive ? 'Active turn' : undefined}
            />
            <div
              className={`flex flex-col gap-2 rounded-lg px-5 py-4 ${
                isActive ? 'creature-card-active' : 'creature-card'
              }`}
            >
              <div className="flex items-center gap-4">
                {readOnly ? (
                  <span className="w-14 text-center text-xl font-bold font-heading text-forge-gold">
                    {creature.initiative !== null ? creature.initiative : '—'}
                  </span>
                ) : (
                  <InitiativeInput
                    creature={creature}
                    onUpdate={onUpdateInitiative}
                  />
                )}
                {!readOnly && (
                  <button
                    onClick={() => onRollInitiative(creature.id)}
                    className="btn-ember shrink-0"
                    aria-label={`Roll initiative for ${creature.name}`}
                  >
                    <Swords size={16} />
                  </button>
                )}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-forge-parchment-light font-heading text-lg font-semibold truncate">
                    {creature.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleCreatureType(creature.id)}
                    className={`text-[10px] font-heading uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 transition-colors cursor-pointer ${
                      creature.creatureType === 'party'
                        ? 'bg-forge-green/30 text-forge-green-light hover:bg-forge-green/50'
                        : 'bg-forge-burgundy/30 text-forge-burgundy-light hover:bg-forge-burgundy/50'
                    }`}
                    aria-label={`Toggle creature type for ${creature.name}`}
                  >
                    {creature.creatureType === 'party' ? 'Party' : 'Enemy'}
                  </button>
                </div>
                {!readOnly && creature.monsterSlug && onShowStatBlock && (
                  <button
                    onClick={() => onShowStatBlock(creature.monsterSlug!)}
                    className="text-forge-tan hover:text-forge-gold transition-colors shrink-0"
                    aria-label={`Show stat block for ${creature.name}`}
                  >
                    <BookOpen size={16} />
                  </button>
                )}
                {!readOnly && (
                  <span className="text-forge-tan text-sm italic shrink-0">
                    {formatModifier(creature.initiativeModifier)}
                  </span>
                )}
                {!readOnly && (
                  <button
                    onClick={() => onRemove(creature.id)}
                    className="text-forge-tan hover:text-forge-burgundy-light transition-colors shrink-0"
                    aria-label={`Remove ${creature.name}`}
                  >
                    <Skull size={16} />
                  </button>
                )}
              </div>
              {showHp && (
                <div className="flex flex-col gap-2">
                  <HealthBar hp={creature.hp} maxHp={creature.maxHp} tempHp={creature.tempHp} />
                  {!readOnly && (
                    <HpControls
                      creatureId={creature.id}
                      onDamage={onDamage}
                      onHeal={onHeal}
                      onSetTempHp={onSetTempHp}
                    />
                  )}
                </div>
              )}
            </div>
          </li>
          )
        })}
      </ul>
    </div>
  )
}
