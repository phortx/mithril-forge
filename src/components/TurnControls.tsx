import { formatInGameTime } from '../utils/formatInGameTime'

type TurnControlsProps = {
  isStarted: boolean
  round: number | null
  onStart: () => void
  onNextTurn: () => void
  onEndEncounter: () => void
}

export function TurnControls({
  isStarted,
  round,
  onStart,
  onNextTurn,
  onEndEncounter,
}: TurnControlsProps) {
  if (!isStarted) {
    return (
      <button
        onClick={onStart}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded transition-colors"
      >
        Start Encounter
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-300 font-medium">Round {round}</span>
      <span className="text-gray-500 text-sm">{formatInGameTime(round!)}</span>
      <button
        onClick={onNextTurn}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded transition-colors"
      >
        Next Turn
      </button>
      <button
        onClick={onEndEncounter}
        className="text-gray-400 hover:text-red-400 text-sm transition-colors"
      >
        End Encounter
      </button>
    </div>
  )
}
