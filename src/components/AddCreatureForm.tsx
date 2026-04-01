import { useState } from 'react'

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
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor="creature-name" className="text-sm text-gray-400">
          Name
        </label>
        <input
          id="creature-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Creature name"
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="initiative-modifier" className="text-sm text-gray-400">
          Initiative Modifier
        </label>
        <input
          id="initiative-modifier"
          type="number"
          value={modifier}
          onChange={(e) => setModifier(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 w-24 focus:outline-none focus:border-gray-500"
        />
      </div>
      <button
        type="submit"
        className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded transition-colors"
      >
        Add
      </button>
    </form>
  )
}
