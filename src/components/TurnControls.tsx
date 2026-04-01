import { formatInGameTime } from '../utils/formatInGameTime'
import { Flame, Hourglass } from 'lucide-react'

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
}: TurnControlsProps) {
  if (!isStarted) {
    return (
      <div className="text-center">
        <button
          onClick={onStart}
          className="btn-forge btn-epic rounded-lg px-10 py-4 flex items-center gap-3 mx-auto"
        >
          <Flame size={20} />
          Start Encounter
          <Flame size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="round-scroll px-4 py-2 flex items-center gap-3 self-start">
      <Hourglass size={16} className="text-forge-gold-dim" />
      <span className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">Round</span>
      <span className="font-heading text-2xl font-bold text-forge-gold">{round}</span>
      <span className="text-forge-tan text-sm italic">
        {formatInGameTime(round!)}
      </span>
    </div>
  )
}
