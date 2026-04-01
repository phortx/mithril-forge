import { useState } from 'react'
import { Plus } from 'lucide-react'

type AddCreatureFormProps = {
  onAdd: (name: string, initiativeModifier: number) => void
}

export function AddCreatureForm({ onAdd }: AddCreatureFormProps) {
  const [name, setName] = useState('')
  const [modifier, setModifier] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, modifier)
    setName('')
    setModifier(0)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex flex-col gap-1.5 flex-1">
        <label htmlFor="creature-name" className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">
          Name
        </label>
        <input
          id="creature-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter creature name..."
          className="input-forge rounded px-3 py-[9px] font-body text-base"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="initiative-modifier" className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">
          Init Mod
        </label>
        <input
          id="initiative-modifier"
          type="number"
          value={modifier}
          onChange={(e) => setModifier(Number(e.target.value))}
          className="input-forge rounded px-3 py-[9px] font-body text-base w-24 text-center"
        />
      </div>
      <button
        type="submit"
        className="btn-forge btn-gold rounded px-5 h-[44px] flex items-center gap-2"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add
      </button>
    </form>
  )
}
