import { useState } from 'react'
import type { Creature } from '../types/creature'
import type { StatVisibility } from '../types/encounterSettings'
import type { ViewMode } from '../types/viewMode'
import { Skull, BookOpen, Shield, Trash2, Dices } from 'lucide-react'
import { HealthBar } from './HealthBar'
import { HpControls } from './HpControls'
import { formatModifier } from '../utils/formatModifier'

type CreatureListProps = {
  creatures: Creature[]
  activeCreatureId: string | null
  readOnly?: boolean
  viewMode: ViewMode
  statVisibility: StatVisibility
  onRemove: (id: string) => void
  onRollInitiative: (id: string) => void
  onUpdateInitiative: (id: string, initiative: number | null) => void
  onToggleCreatureType: (id: string) => void
  onDamage: (id: string, amount: number) => void
  onHeal: (id: string, amount: number) => void
  onSetTempHp: (id: string, amount: number) => void
  onShowStatBlock?: (monsterSlug: string) => void
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
      title="Initiative"
      className="w-14 text-center text-xl font-bold font-heading text-forge-gold hover:bg-forge-brown rounded px-1 py-0.5 transition-colors"
      aria-label={`Edit initiative for ${creature.name}`}
    >
      {creature.initiative !== null ? creature.initiative : '—'}
    </button>
  )
}

function shouldShowStats(
  viewMode: ViewMode,
  statVisibility: StatVisibility,
  creature: Creature,
): boolean {
  if (viewMode === 'dm') return true
  if (statVisibility === 'all') return true
  if (statVisibility === 'party-only') return creature.creatureType === 'party'
  return false
}

export function CreatureList({
  creatures,
  activeCreatureId,
  readOnly = false,
  viewMode,
  statVisibility,
  onRemove,
  onUpdateInitiative,
  onToggleCreatureType,
  onDamage,
  onHeal,
  onSetTempHp,
  onShowStatBlock,
}: CreatureListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [hoveredDeadId, setHoveredDeadId] = useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (creatures.length === 0) {
    return <p className="text-forge-tan italic text-center">No creatures have entered the fray...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-6 ml-10">
        {creatures.map((creature) => {
          const isActive = creature.id === activeCreatureId
          const isDead = creature.hp <= 0 && creature.maxHp > 0
          const isReviveHover = isDead && hoveredDeadId === creature.id
          const showStats = shouldShowStats(viewMode, statVisibility, creature)
          const isExpanded = isActive || expandedIds.has(creature.id)
          return (
          <li
            key={creature.id}
            className="relative"
          >
            <div
              className={`relative flex flex-row items-stretch ${isDead && !isReviveHover ? 'opacity-60' : ''} ${isReviveHover ? 'revive-pulse' : ''}`}
              onClick={(e) => {
                if (isActive) return
                if ((e.target as HTMLElement).closest('button, input')) return
                toggleExpanded(creature.id)
              }}
            >
              {/* Active turn indicator (screen-reader accessible) */}
              {isActive && <span className="sr-only" aria-label="Active turn">Active turn</span>}
              {/* Health orb — centered on card edge via negative margins */}
              {showStats && (
                <div
                  className="shrink-0 self-stretch w-0 relative z-10 -my-2"
                  onMouseEnter={() => isDead && !readOnly && setHoveredDeadId(creature.id)}
                  onMouseLeave={() => isDead && setHoveredDeadId(null)}
                  onClick={() => {
                    if (isDead && !readOnly) {
                      onHeal(creature.id, 1)
                      setHoveredDeadId(null)
                    }
                  }}
                  style={{ cursor: isDead && !readOnly ? 'pointer' : undefined }}
                >
                  <HealthBar hp={creature.hp} maxHp={creature.maxHp} tempHp={creature.tempHp} id={creature.id} isActive={isActive} isDead={isDead} isReviveHover={isReviveHover} />
                  <span className="sr-only">{creature.hp}/{creature.maxHp}</span>
                </div>
              )}
              {/* Card body */}
              <div
                className={`relative overflow-visible flex-1 min-w-0 rounded-lg ${showStats ? 'pl-20' : 'pl-5'} pr-5 py-4 ${
                  isActive ? 'creature-card-active' : 'creature-card'
                } ${!isActive ? 'cursor-pointer' : ''}`}
              >
              <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="relative flex items-center gap-3">
                {readOnly ? (
                  <span className="w-14 text-center text-xl font-bold font-heading text-forge-gold shrink-0" title="Initiative">
                    {creature.initiative !== null ? creature.initiative : '—'}
                  </span>
                ) : (
                  <InitiativeInput
                    creature={creature}
                    onUpdate={onUpdateInitiative}
                  />
                )}
                {showStats && (
                  <span className="flex items-center gap-1 text-lg font-heading font-semibold text-forge-tan shrink-0" title="Armor Class">
                    <Shield size={16} />
                    {creature.ac}
                  </span>
                )}
                <span className={`font-heading text-lg font-semibold truncate flex-1 min-w-0 ${isDead ? 'text-forge-tan/60 line-through' : 'text-forge-parchment-light'}`}>
                  {creature.name}
                </span>
                {isDead && !showStats && (
                  <span className="text-xs font-heading uppercase tracking-wider px-2 py-1 rounded shrink-0 flex items-center gap-1 bg-forge-burgundy/40 text-forge-burgundy-light">
                    <Skull size={12} />
                    Dead
                  </span>
                )}
                {!readOnly && creature.monsterSlug && onShowStatBlock && (
                  <button
                    onClick={() => onShowStatBlock(creature.monsterSlug!)}
                    className="text-forge-tan hover:text-forge-gold transition-colors shrink-0"
                    aria-label={`Show stat block for ${creature.name}`}
                  >
                    <BookOpen size={16} />
                  </button>
                )}
                {readOnly ? (
                  <span
                    className={`text-xs font-heading uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                      creature.creatureType === 'party'
                        ? 'bg-forge-green/30 text-forge-green-light'
                        : 'bg-forge-burgundy/30 text-forge-burgundy-light'
                    }`}
                  >
                    {creature.creatureType === 'party' ? 'Party' : 'Enemy'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleCreatureType(creature.id)}
                    className={`text-xs font-heading uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 transition-colors cursor-pointer ${
                      creature.creatureType === 'party'
                        ? 'bg-forge-green/30 text-forge-green-light hover:bg-forge-green/50'
                        : 'bg-forge-burgundy/30 text-forge-burgundy-light hover:bg-forge-burgundy/50'
                    }`}
                    aria-label={`Toggle creature type for ${creature.name}`}
                  >
                    {creature.creatureType === 'party' ? 'Party' : 'Enemy'}
                  </button>
                )}
              </div>
              {isExpanded && !readOnly && showStats && (
                <div className="relative flex items-center gap-1.5">
                  {!isDead && (
                    <HpControls
                      creatureId={creature.id}
                      onDamage={onDamage}
                      onHeal={onHeal}
                      onSetTempHp={onSetTempHp}
                    />
                  )}
                  <span className="flex items-center gap-1 text-forge-tan text-sm italic shrink-0" title="Initiative Modifier">
                    <Dices size={14} />
                    {formatModifier(creature.initiativeModifier)}
                  </span>
                  {isDead ? (
                    <button
                      onClick={() => onRemove(creature.id)}
                      className="btn-forge btn-secondary rounded px-3 py-1.5 text-xs flex items-center gap-1.5 shrink-0 ml-auto"
                      aria-label={`Remove ${creature.name}`}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => onDamage(creature.id, creature.hp + creature.tempHp)}
                      className="text-forge-tan hover:text-forge-burgundy-light transition-colors shrink-0 ml-auto flex items-center gap-1 text-xs font-heading uppercase tracking-wider"
                      aria-label={`Kill ${creature.name}`}
                    >
                      <Skull size={14} />
                      Kill
                    </button>
                  )}
                </div>
              )}
              </div>
              </div>
            </div>
          </li>
          )
        })}
      </ul>
    </div>
  )
}
