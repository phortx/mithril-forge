import { useEffect, useReducer } from 'react'
import { X, Loader2 } from 'lucide-react'
import { getMonster, abilityModifier } from '../api/open5e'
import { formatModifier } from '../utils/formatModifier'
import type { MonsterData, MonsterAction } from '../types/statBlock'

type StatBlockPanelProps = {
  monsterSlug: string
  onClose: () => void
}

const ABILITY_NAMES = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' },
] as const

function StatDivider() {
  return <div className="h-px bg-forge-burgundy/60 my-2" />
}

function AbilityScoreTable({ monster }: { monster: MonsterData }) {
  return (
    <div className="grid grid-cols-6 gap-1 text-center">
      {ABILITY_NAMES.map(({ key, label }) => {
        const score = monster[key]
        const mod = abilityModifier(score)
        return (
          <div key={key}>
            <div className="text-[10px] font-heading uppercase tracking-wider text-forge-gold-dim">{label}</div>
            <div className="font-heading font-bold text-forge-parchment-light">{score}</div>
            <div className="text-xs text-forge-parchment">({formatModifier(mod)})</div>
          </div>
        )
      })}
    </div>
  )
}

function SavingThrows({ monster }: { monster: MonsterData }) {
  const saves = ABILITY_NAMES
    .map(({ key, label }) => {
      const saveKey = `${key}_save` as keyof MonsterData
      const val = monster[saveKey] as number | null
      return val !== null ? `${label} ${formatModifier(val)}` : null
    })
    .filter(Boolean)

  if (saves.length === 0) return null
  return <PropertyLine label="Saving Throws" value={saves.join(', ')} />
}

function PropertyLine({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <p className="text-sm">
      <span className="font-heading font-bold text-forge-parchment-light">{label}</span>{' '}
      <span className="text-forge-parchment">{value}</span>
    </p>
  )
}

function ActionBlock({ title, actions }: { title: string; actions: MonsterAction[] }) {
  if (actions.length === 0) return null
  return (
    <>
      <StatDivider />
      <h4 className="font-heading text-lg font-bold text-forge-burgundy-light">{title}</h4>
      {actions.map((action) => (
        <div key={action.name} className="text-sm mt-1.5">
          <span className="font-heading font-bold italic text-forge-parchment-light">{action.name}.</span>{' '}
          <span className="text-forge-parchment">{action.desc}</span>
        </div>
      ))}
    </>
  )
}

function SpeedDisplay({ speed }: { speed: Record<string, number> }) {
  const parts = Object.entries(speed)
    .filter(([, v]) => v > 0)
    .map(([type, val]) => (type === 'walk' ? `${val} ft.` : `${type} ${val} ft.`))
  return <PropertyLine label="Speed" value={parts.join(', ')} />
}

function xpByCr(cr: string): string {
  const xpMap: Record<string, string> = {
    '0': '0 or 10', '1/8': '25', '1/4': '50', '1/2': '100',
    '1': '200', '2': '450', '3': '700', '4': '1,100', '5': '1,800',
    '6': '2,300', '7': '2,900', '8': '3,900', '9': '5,000', '10': '5,900',
    '11': '7,200', '12': '8,400', '13': '10,000', '14': '11,500', '15': '13,000',
    '16': '15,000', '17': '18,000', '18': '20,000', '19': '22,000', '20': '25,000',
    '21': '33,000', '22': '41,000', '23': '50,000', '24': '62,000', '25': '75,000',
    '26': '90,000', '27': '105,000', '28': '120,000', '29': '135,000', '30': '155,000',
  }
  return xpMap[cr] ?? '—'
}

export function StatBlockPanel({ monsterSlug, onClose }: StatBlockPanelProps) {
  type FetchState = {
    monster: MonsterData | null
    loading: boolean
    error: string | null
  }

  type FetchAction =
    | { type: 'fetch' }
    | { type: 'success'; data: MonsterData }
    | { type: 'failure'; error: string }

  const [state, dispatch] = useReducer(
    (_prev: FetchState, action: FetchAction): FetchState => {
      switch (action.type) {
        case 'fetch':
          return { monster: null, loading: true, error: null }
        case 'success':
          return { monster: action.data, loading: false, error: null }
        case 'failure':
          return { monster: null, loading: false, error: action.error }
      }
    },
    { monster: null, loading: true, error: null },
  )

  const { monster, loading, error } = state

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'fetch' })

    getMonster(monsterSlug)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'success', data })
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: 'failure', error: err instanceof Error ? err.message : 'Failed to load monster' })
      })

    return () => { cancelled = true }
  }, [monsterSlug])

  return (
    <div className="fixed inset-y-0 right-0 w-96 z-50 flex flex-col bg-forge-darkest/95 border-l border-forge-leather shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-forge-leather">
        <h3 className="font-heading text-sm uppercase tracking-wider text-forge-gold-dim">Stat Block</h3>
        <button
          onClick={onClose}
          className="text-forge-tan hover:text-forge-parchment-light transition-colors"
          aria-label="Close stat block"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center py-12 text-forge-tan">
            <Loader2 size={24} className="animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-forge-burgundy-light text-sm text-center py-8">
            {error}
          </div>
        )}

        {monster && (
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-2xl font-bold text-forge-burgundy-light">{monster.name}</h3>
            <p className="text-sm italic text-forge-parchment">
              {monster.size} {monster.type}, {monster.alignment}
            </p>

            <StatDivider />

            <PropertyLine
              label="Armor Class"
              value={`${monster.armor_class}${monster.armor_desc ? ` (${monster.armor_desc})` : ''}`}
            />
            <PropertyLine
              label="Hit Points"
              value={`${monster.hit_points} (${monster.hit_dice})`}
            />
            <SpeedDisplay speed={monster.speed} />

            <StatDivider />

            <AbilityScoreTable monster={monster} />

            <StatDivider />

            <SavingThrows monster={monster} />
            {monster.perception !== null && (
              <PropertyLine label="Skills" value={`Perception ${formatModifier(monster.perception)}`} />
            )}
            {monster.damage_vulnerabilities && (
              <PropertyLine label="Damage Vulnerabilities" value={monster.damage_vulnerabilities} />
            )}
            {monster.damage_resistances && (
              <PropertyLine label="Damage Resistances" value={monster.damage_resistances} />
            )}
            {monster.damage_immunities && (
              <PropertyLine label="Damage Immunities" value={monster.damage_immunities} />
            )}
            {monster.condition_immunities && (
              <PropertyLine label="Condition Immunities" value={monster.condition_immunities} />
            )}
            <PropertyLine label="Senses" value={monster.senses} />
            <PropertyLine label="Languages" value={monster.languages || '—'} />
            <PropertyLine
              label="Challenge"
              value={`${monster.challenge_rating} (${xpByCr(monster.challenge_rating)} XP)`}
            />

            <ActionBlock title="Special Abilities" actions={monster.special_abilities} />
            <ActionBlock title="Actions" actions={monster.actions} />
            <ActionBlock title="Reactions" actions={monster.reactions ?? []} />
            <ActionBlock title="Legendary Actions" actions={monster.legendary_actions ?? []} />
          </div>
        )}
      </div>
    </div>
  )
}
