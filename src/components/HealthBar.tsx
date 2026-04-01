type HealthBarProps = {
  hp: number
  maxHp: number
  tempHp: number
}

function getBarColor(percent: number): string {
  if (percent > 50) return 'bg-forge-green'
  if (percent > 25) return 'bg-forge-gold-dim'
  return 'bg-forge-burgundy'
}

export function HealthBar({ hp, maxHp, tempHp }: HealthBarProps) {
  const hpPercent = Math.min(100, (hp / maxHp) * 100)
  const tempPercent = Math.min(100 - hpPercent, (tempHp / maxHp) * 100)
  const totalPercent = Math.round(hpPercent + tempPercent)

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2.5 bg-forge-brown rounded-full overflow-hidden relative">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${getBarColor(hpPercent)}`}
          style={{ width: `${hpPercent}%` }}
        />
        {tempHp > 0 && (
          <div
            className="absolute inset-y-0 rounded-full bg-forge-ember opacity-80 transition-all duration-300"
            style={{ left: `${hpPercent}%`, width: `${tempPercent}%` }}
          />
        )}
      </div>
      <span className="text-sm font-heading text-forge-tan whitespace-nowrap tabular-nums">
        {hp}
        {tempHp > 0 && <span className="text-forge-ember">+{tempHp}</span>}
        /{maxHp}
        <span className="text-forge-gold-dim ml-1">({totalPercent}%)</span>
      </span>
    </div>
  )
}
