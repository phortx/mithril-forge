import { useState } from 'react'
import type { Creature } from '../types/creature'
import type { StatVisibility } from '../types/encounterSettings'
import type { ViewMode } from '../types/viewMode'
import { CreatureCard } from './CreatureCard'

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
          const showStats = shouldShowStats(viewMode, statVisibility, creature)
          const isExpanded = isActive || expandedIds.has(creature.id)
          return (
            <CreatureCard
              key={creature.id}
              creature={creature}
              isActive={isActive}
              isExpanded={isExpanded}
              showStats={showStats}
              readOnly={readOnly}
              hoveredDeadId={hoveredDeadId}
              onSetHoveredDeadId={setHoveredDeadId}
              onToggleExpanded={toggleExpanded}
              onRemove={onRemove}
              onUpdateInitiative={onUpdateInitiative}
              onToggleCreatureType={onToggleCreatureType}
              onDamage={onDamage}
              onHeal={onHeal}
              onSetTempHp={onSetTempHp}
              onShowStatBlock={onShowStatBlock}
            />
          )
        })}
      </ul>
    </div>
  )
}
