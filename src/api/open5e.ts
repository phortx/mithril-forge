import type { MonsterData, MonsterSearchResult } from '../types/statBlock'

const BASE_URL = 'https://api.open5e.com/v1'

const monsterCache = new Map<string, MonsterData>()

type Open5eSearchResponse = {
  results: MonsterData[]
}

export async function searchMonsters(query: string): Promise<MonsterSearchResult[]> {
  if (query.trim().length < 2) return []

  const params = new URLSearchParams({
    search: query.trim(),
    limit: '10',
    document__slug: 'wotc-srd',
  })

  const res = await fetch(`${BASE_URL}/monsters/?${params}`)
  if (!res.ok) throw new Error(`Open5e search failed: ${res.status}`)

  const data: Open5eSearchResponse = await res.json()

  // Cache full results while we have them
  for (const monster of data.results) {
    monsterCache.set(monster.slug, monster)
  }

  return data.results.map((m) => ({
    slug: m.slug,
    name: m.name,
    challenge_rating: m.challenge_rating,
    type: m.type,
    hit_points: m.hit_points,
    dexterity: m.dexterity,
    armor_class: m.armor_class,
  }))
}

export async function getMonster(slug: string): Promise<MonsterData> {
  const cached = monsterCache.get(slug)
  if (cached) return cached

  const res = await fetch(`${BASE_URL}/monsters/${slug}/`)
  if (!res.ok) throw new Error(`Open5e fetch failed: ${res.status}`)

  const data: MonsterData = await res.json()
  monsterCache.set(slug, data)
  return data
}

export function getCachedMonster(slug: string): MonsterData | undefined {
  return monsterCache.get(slug)
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}
