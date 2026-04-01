import { useEncounter } from './hooks/useEncounter'
import { useTurnTracker } from './hooks/useTurnTracker'
import { AddCreatureForm } from './components/AddCreatureForm'
import { CreatureList } from './components/CreatureList'
import { TurnControls } from './components/TurnControls'
import { Dices, SkipForward, Flag } from 'lucide-react'

function App() {
  const {
    creatures,
    addCreature,
    removeCreature,
    updateCreature,
    rollCreatureInitiative,
    rollAllInitiative,
  } = useEncounter()

  const { turnState, isStarted, startEncounter, nextTurn, endEncounter } =
    useTurnTracker(creatures)

  return (
    <div className="page-texture relative min-h-screen bg-forge-darkest text-forge-parchment font-body">
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6 p-8">
        <header className="text-center">
          <h1 className="font-title text-5xl font-bold text-forge-gold tracking-widest title-glow">
            Mithril Forge
          </h1>
          <p className="text-forge-tan text-sm mt-2 font-heading tracking-[0.2em] uppercase">
            Encounter Tracker
          </p>
        </header>

        <div className="ornament-divider font-heading text-sm">&#x2726;</div>

        <div className="panel-parchment panel-ornate rounded-lg p-6">
          <AddCreatureForm onAdd={addCreature} />
        </div>

        {isStarted ? (
          <div className="flex items-center gap-4">
            <TurnControls
              isStarted={isStarted}
              round={turnState?.round ?? null}
              onStart={startEncounter}
              onNextTurn={nextTurn}
              onEndEncounter={endEncounter}
            />
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={rollAllInitiative}
                className="btn-forge btn-gold rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Dices size={14} />
                Roll All
              </button>
              <button
                onClick={nextTurn}
                className="btn-forge btn-gold rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <SkipForward size={14} />
                Next Turn
              </button>
              <button
                onClick={endEncounter}
                className="btn-forge btn-secondary rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Flag size={14} />
                End
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <TurnControls
              isStarted={isStarted}
              round={turnState?.round ?? null}
              onStart={startEncounter}
              onNextTurn={nextTurn}
              onEndEncounter={endEncounter}
            />
            {creatures.length > 0 && (
              <button
                onClick={rollAllInitiative}
                className="btn-forge btn-gold rounded px-3 py-1.5 text-xs ml-auto flex items-center gap-1.5"
              >
                <Dices size={14} />
                Roll All Initiative
              </button>
            )}
          </div>
        )}

        <CreatureList
          creatures={creatures}
          activeCreatureId={turnState?.activeCreatureId ?? null}
          onRemove={removeCreature}
          onRollInitiative={rollCreatureInitiative}
          onRollAll={rollAllInitiative}
          onUpdateInitiative={(id, init) =>
            updateCreature(id, { initiative: init })
          }
        />
      </div>
    </div>
  )
}

export default App
