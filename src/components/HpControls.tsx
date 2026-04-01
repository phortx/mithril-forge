import { useState } from 'react'
import { Minus, Plus, Shield } from 'lucide-react'

type HpControlsProps = {
  creatureId: string
  onDamage: (id: string, amount: number) => void
  onHeal: (id: string, amount: number) => void
  onSetTempHp: (id: string, amount: number) => void
}

export function HpControls({
  creatureId,
  onDamage,
  onHeal,
  onSetTempHp,
}: HpControlsProps) {
  const [amount, setAmount] = useState('')

  const apply = (action: (id: string, amount: number) => void) => {
    const parsed = parseInt(amount, 10)
    if (isNaN(parsed) || parsed <= 0) return
    action(creatureId, parsed)
    setAmount('')
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => apply(onDamage)}
        className="btn-forge btn-damage rounded px-2 py-1 text-xs flex items-center gap-1"
        aria-label="Apply damage"
      >
        <Minus size={12} />
        Dmg
      </button>
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        className="input-forge rounded px-2 py-1 text-sm w-16 text-center tabular-nums"
        aria-label="HP amount"
        onKeyDown={(e) => {
          if (e.key === 'Enter') apply(onDamage)
        }}
      />
      <button
        onClick={() => apply(onHeal)}
        className="btn-forge btn-heal rounded px-2 py-1 text-xs flex items-center gap-1"
        aria-label="Apply healing"
      >
        <Plus size={12} />
        Heal
      </button>
      <button
        onClick={() => apply(onSetTempHp)}
        className="btn-forge btn-secondary rounded px-2 py-1 text-xs flex items-center gap-1"
        aria-label="Set temporary HP"
      >
        <Shield size={12} />
        Temp
      </button>
    </div>
  )
}
