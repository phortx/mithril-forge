import { useState } from 'react'
import { Plus, Users, Swords } from 'lucide-react'
import type { CreatureType } from '../types/creature'
import type { MonsterSearchResult } from '../types/statBlock'
import { MonsterAutocomplete } from './MonsterAutocomplete'
import { abilityModifier } from '../api/open5e'
import { NumberInput } from './NumberInput'

type AddCreatureFormProps = {
  onAdd: (name: string, initiativeModifier: number, creatureType: CreatureType, maxHp: number, ac: number, monsterSlug?: string | null) => void
}

export function AddCreatureForm({ onAdd }: AddCreatureFormProps) {
  const [name, setName] = useState('')
  const [modifier, setModifier] = useState(0)
  const [creatureType, setCreatureType] = useState<CreatureType>('enemy')
  const [maxHp, setMaxHp] = useState(10)
  const [ac, setAc] = useState(10)
  const [monsterSlug, setMonsterSlug] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleMonsterSelect = (monster: MonsterSearchResult) => {
    setName(monster.name)
    setModifier(abilityModifier(monster.dexterity))
    setMaxHp(monster.hit_points)
    setAc(monster.armor_class)
    setMonsterSlug(monster.slug)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    const count = creatureType === 'enemy' ? quantity : 1

    if (count === 1) {
      onAdd(trimmed, modifier, creatureType, Math.max(1, maxHp), Math.max(0, ac), monsterSlug)
    } else {
      for (let i = 1; i <= count; i++) {
        onAdd(`${trimmed} ${i}`, modifier, creatureType, Math.max(1, maxHp), Math.max(0, ac), monsterSlug)
      }
    }

    setName('')
    setModifier(0)
    setMaxHp(10)
    setAc(10)
    setMonsterSlug(null)
    setQuantity(1)
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
              id="creature-name"
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
              onClick={() => { setCreatureType('party'); setMonsterSlug(null); setQuantity(1) }}
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
          <NumberInput
            id="initiative-modifier"
            value={modifier}
            onChange={(v) => setModifier(Number(v))}
            containerClassName="h-[42px] w-28"
            className="text-base font-body"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="max-hp" className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">
            Max HP
          </label>
          <NumberInput
            id="max-hp"
            min={1}
            value={maxHp}
            onChange={(v) => setMaxHp(Number(v))}
            containerClassName="h-[42px] w-28"
            className="text-base font-body"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ac" className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">
            AC
          </label>
          <NumberInput
            id="ac"
            min={0}
            value={ac}
            onChange={(v) => setAc(Number(v))}
            containerClassName="h-[42px] w-28"
            className="text-base font-body"
          />
        </div>
        {creatureType === 'enemy' && (
          <div className="flex flex-col gap-1.5">
            <span className="font-heading text-xs text-forge-gold-dim uppercase tracking-wider">Qty</span>
            <NumberInput
              aria-label="qty"
              value={quantity}
              onChange={(v) => setQuantity(Number(v))}
              min={1}
              max={99}
              containerClassName="h-[42px] w-28"
              className="text-base font-heading qty-bump"
            />
          </div>
        )}
        <button
          type="submit"
          className="btn-forge btn-gold rounded px-5 h-[42px] flex items-center gap-2 ml-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          {quantity > 1 && creatureType === 'enemy' ? `Add x${quantity}` : 'Add'}
        </button>
      </div>
    </form>
  )
}
