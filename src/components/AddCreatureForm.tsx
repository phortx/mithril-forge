import { useState } from 'react'
import { Plus, Users, Swords } from 'lucide-react'
import type { CreatureType } from '../types/creature'
import type { MonsterSearchResult } from '../types/statBlock'
import { MonsterAutocomplete } from './MonsterAutocomplete'
import { abilityModifier } from '../api/open5e'

type AddCreatureFormProps = {
  onAdd: (name: string, initiativeModifier: number, creatureType: CreatureType, maxHp: number, monsterSlug?: string | null) => void
}

export function AddCreatureForm({ onAdd }: AddCreatureFormProps) {
  const [name, setName] = useState('')
  const [modifier, setModifier] = useState(0)
  const [creatureType, setCreatureType] = useState<CreatureType>('enemy')
  const [maxHp, setMaxHp] = useState(10)
  const [monsterSlug, setMonsterSlug] = useState<string | null>(null)

  const handleMonsterSelect = (monster: MonsterSearchResult) => {
    setName(monster.name)
    setModifier(abilityModifier(monster.dexterity))
    setMaxHp(monster.hit_points)
    setMonsterSlug(monster.slug)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, modifier, creatureType, Math.max(1, maxHp), monsterSlug)
    setName('')
    setModifier(0)
    setMaxHp(10)
    setMonsterSlug(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="creature-name" className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">
            Name
          </label>
          {creatureType === 'enemy' ? (
            <MonsterAutocomplete
              value={name}
              onChange={(v) => { setName(v); setMonsterSlug(null) }}
              onSelect={handleMonsterSelect}
            />
          ) : (
            <input
              id="creature-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter creature name..."
              className="input-forge rounded px-3 py-[9px] font-body text-base"
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">Type</span>
          <div className="flex h-[42px]">
            <button
              type="button"
              onClick={() => setCreatureType('party')}
              className={`rounded-l px-3 py-1.5 text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                creatureType === 'party'
                  ? 'bg-forge-green text-forge-parchment-light'
                  : 'bg-forge-brown text-forge-tan hover:bg-forge-leather'
              }`}
            >
              <Users size={12} />
              Party
            </button>
            <button
              type="button"
              onClick={() => setCreatureType('enemy')}
              className={`rounded-r px-3 py-1.5 text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                creatureType === 'enemy'
                  ? 'bg-forge-burgundy text-forge-parchment-light'
                  : 'bg-forge-brown text-forge-tan hover:bg-forge-leather'
              }`}
            >
              <Swords size={12} />
              Enemy
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-end">
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="max-hp" className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">
            Max HP
          </label>
          <input
            id="max-hp"
            type="number"
            min="1"
            value={maxHp}
            onChange={(e) => setMaxHp(Number(e.target.value))}
            className="input-forge rounded px-3 py-[9px] font-body text-base w-24 text-center"
          />
        </div>
        <button
          type="submit"
          className="btn-forge btn-gold rounded px-5 h-[42px] flex items-center gap-2 ml-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add
        </button>
      </div>
    </form>
  )
}
