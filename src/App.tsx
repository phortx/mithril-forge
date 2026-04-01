import { useState } from 'react'
import { useEncounter } from './hooks/useEncounter'
import { useEncounterSettings } from './hooks/useEncounterSettings'
import { useTurnTracker } from './hooks/useTurnTracker'
import { AddCreatureForm } from './components/AddCreatureForm'
import { CreatureList } from './components/CreatureList'
import { EncounterToolbar } from './components/EncounterToolbar'
import { StatBlockPanel } from './components/StatBlockPanel'
import { Eye, Crown, Heart, HeartOff, Users } from 'lucide-react'
import type { ViewMode } from './types/viewMode'
import type { StatVisibility } from './types/encounterSettings'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dm')
  const [statBlockSlug, setStatBlockSlug] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const isDM = viewMode === 'dm'

  const {
    creatures,
    addCreature,
    removeCreature,
    updateCreature,
    rollCreatureInitiative,
    rollAllInitiative,
    applyDamage,
    applyHealing,
    setTempHp,
  } = useEncounter()

  const { settings, setStatVisibility } = useEncounterSettings()

  const { turnState, isStarted, startEncounter, nextTurn, endEncounter } =
    useTurnTracker(creatures)

  const statVisibilityOptions: { value: StatVisibility; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Heart size={10} /> },
    { value: 'party-only', label: 'Party', icon: <Users size={10} /> },
    { value: 'none', label: 'Hidden', icon: <HeartOff size={10} /> },
  ]

  return (
    <div className="page-texture relative min-h-screen bg-forge-darkest text-forge-parchment font-body">
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6 p-8">
        <header className="text-center">
          <h1 className="font-title text-5xl font-bold text-forge-gold tracking-widest title-glow">
            Mithril Forge
          </h1>
          <p className="text-forge-tan text-sm mt-2 font-heading tracking-[0.2em] uppercase">
            Encounter Tracker
          </p>
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex gap-0">
              <button
                onClick={() => setViewMode('dm')}
                className={`rounded-l px-5 py-2 text-sm font-heading uppercase tracking-wider flex items-center gap-2 transition-colors ${
                  isDM
                    ? 'bg-forge-gold text-forge-darkest'
                    : 'bg-forge-brown text-forge-tan hover:bg-forge-leather'
                }`}
              >
                <Crown size={16} />
                DM
              </button>
              <button
                onClick={() => setViewMode('player')}
                className={`rounded-r px-5 py-2 text-sm font-heading uppercase tracking-wider flex items-center gap-2 transition-colors ${
                  !isDM
                    ? 'bg-forge-gold text-forge-darkest'
                    : 'bg-forge-brown text-forge-tan hover:bg-forge-leather'
                }`}
              >
                <Eye size={16} />
                Player
              </button>
            </div>
            {isDM && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading text-forge-tan uppercase tracking-wider">Stats</span>
                <div className="flex gap-0">
                  {statVisibilityOptions.map((opt, i) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatVisibility(opt.value)}
                      className={`px-2.5 py-1 text-xs font-heading uppercase tracking-wider flex items-center gap-1 transition-colors ${
                        i === 0 ? 'rounded-l' : ''
                      }${i === statVisibilityOptions.length - 1 ? 'rounded-r' : ''} ${
                        settings.statVisibility === opt.value
                          ? 'bg-forge-tan/20 text-forge-parchment-light'
                          : 'bg-forge-brown/40 text-forge-tan/60 hover:bg-forge-brown/60'
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="ornament-divider font-heading text-sm">&#x2726;</div>

        {isDM && (creatures.length === 0 || showAddForm) && (
          <div className="panel-parchment panel-ornate rounded-lg p-6">
            <AddCreatureForm onAdd={addCreature} />
          </div>
        )}

        <EncounterToolbar
          isDM={isDM}
          isStarted={isStarted}
          turnState={turnState}
          hasCreatures={creatures.length > 0}
          showAddForm={showAddForm}
          onToggleAddForm={() => setShowAddForm((v) => !v)}
          onStart={startEncounter}
          onNextTurn={nextTurn}
          onEndEncounter={endEncounter}
          onRollAll={rollAllInitiative}
        />

        <CreatureList
          creatures={creatures}
          activeCreatureId={turnState?.activeCreatureId ?? null}
          readOnly={!isDM}
          viewMode={viewMode}
          statVisibility={settings.statVisibility}
          onRemove={removeCreature}
          onRollInitiative={rollCreatureInitiative}
          onUpdateInitiative={(id, init) =>
            updateCreature(id, { initiative: init })
          }
          onToggleCreatureType={(id) => {
            const creature = creatures.find((c) => c.id === id)
            if (creature) {
              updateCreature(id, {
                creatureType: creature.creatureType === 'party' ? 'enemy' : 'party',
              })
            }
          }}
          onDamage={applyDamage}
          onHeal={applyHealing}
          onSetTempHp={setTempHp}
          onShowStatBlock={isDM ? setStatBlockSlug : undefined}
        />
      </div>

      {isDM && statBlockSlug && (
        <StatBlockPanel
          monsterSlug={statBlockSlug}
          onClose={() => setStatBlockSlug(null)}
        />
      )}
    </div>
  )
}

export default App
