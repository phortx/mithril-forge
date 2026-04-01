import { TurnControls } from './TurnControls'
import { Dices, SkipForward, Flag, Plus, RotateCcw } from 'lucide-react'
import type { TurnState } from '../types/turnState'

type EncounterToolbarProps = {
  isDM: boolean
  isStarted: boolean
  turnState: TurnState
  hasCreatures: boolean
  hasCreaturesWithoutInitiative: boolean
  showAddForm: boolean
  onToggleAddForm: () => void
  onStart: () => void
  onNextTurn: () => void
  onEndEncounter: () => void
  onRollAll: () => void
  onReset: () => void
}

export function EncounterToolbar({
  isDM,
  isStarted,
  turnState,
  hasCreatures,
  hasCreaturesWithoutInitiative,
  showAddForm,
  onToggleAddForm,
  onStart,
  onNextTurn,
  onEndEncounter,
  onRollAll,
  onReset,
}: EncounterToolbarProps) {
  if (isDM) {
    if (isStarted) {
      return (
        <div className="flex items-center gap-4">
          <TurnControls
            isStarted={isStarted}
            round={turnState?.round ?? null}
            onStart={onStart}
            onNextTurn={onNextTurn}
            onEndEncounter={onEndEncounter}
          />
          <div className="flex items-center gap-2 ml-auto">
            {hasCreatures && (
              <button
                onClick={onToggleAddForm}
                className={`btn-forge rounded px-3 py-1.5 text-xs flex items-center gap-1.5 ${
                  showAddForm ? 'btn-secondary' : 'btn-gold'
                }`}
              >
                <Plus size={14} />
                Add
              </button>
            )}
            {hasCreaturesWithoutInitiative && (
              <button
                onClick={onRollAll}
                className="btn-forge btn-gold rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Dices size={14} />
                Roll All
              </button>
            )}
            <button
              onClick={onNextTurn}
              className="btn-forge btn-gold rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <SkipForward size={14} />
              Next Turn
            </button>
            <button
              onClick={onEndEncounter}
              className="btn-forge btn-secondary rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Flag size={14} />
              End
            </button>
            <button
              onClick={onReset}
              className="btn-forge btn-secondary rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-4">
        <TurnControls
          isStarted={isStarted}
          round={turnState?.round ?? null}
          onStart={onStart}
          onNextTurn={onNextTurn}
          onEndEncounter={onEndEncounter}
        />
        {hasCreatures && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onToggleAddForm}
              className={`btn-forge rounded px-3 py-1.5 text-xs flex items-center gap-1.5 ${
                showAddForm ? 'btn-gold' : 'btn-secondary'
              }`}
            >
              <Plus size={14} />
              Add
            </button>
            {hasCreaturesWithoutInitiative && (
              <button
                onClick={onRollAll}
                className="btn-forge btn-gold rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Dices size={14} />
                Roll All Initiative
              </button>
            )}
            <button
              onClick={onReset}
              className="btn-forge btn-secondary rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        )}
      </div>
    )
  }

  // Player view: only show turn controls when encounter is started
  if (isStarted) {
    return (
      <TurnControls
        isStarted={isStarted}
        round={turnState?.round ?? null}
        onStart={onStart}
        onNextTurn={onNextTurn}
        onEndEncounter={onEndEncounter}
      />
    )
  }

  return null
}
