import { TurnControls } from './TurnControls'
import { Dices, SkipForward, Flag } from 'lucide-react'
import type { TurnState } from '../types/turnState'

type EncounterToolbarProps = {
  isDM: boolean
  isStarted: boolean
  turnState: TurnState
  hasCreatures: boolean
  onStart: () => void
  onNextTurn: () => void
  onEndEncounter: () => void
  onRollAll: () => void
}

export function EncounterToolbar({
  isDM,
  isStarted,
  turnState,
  hasCreatures,
  onStart,
  onNextTurn,
  onEndEncounter,
  onRollAll,
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
            <button
              onClick={onRollAll}
              className="btn-forge btn-gold rounded px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Dices size={14} />
              Roll All
            </button>
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
          <button
            onClick={onRollAll}
            className="btn-forge btn-gold rounded px-3 py-1.5 text-xs ml-auto flex items-center gap-1.5"
          >
            <Dices size={14} />
            Roll All Initiative
          </button>
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
