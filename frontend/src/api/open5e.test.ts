import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { abilityModifier, clearMonsterCache, getCachedMonster, getMonster, searchMonsters } from './open5e'
import type { MonsterData } from '../types/statBlock'

describe('abilityModifier', () => {
  it('returns 0 for score 10', () => {
    expect(abilityModifier(10)).toBe(0)
  })

  it('returns 0 for score 11 (floors down)', () => {
    expect(abilityModifier(11)).toBe(0)
  })

  it('returns 1 for score 12', () => {
    expect(abilityModifier(12)).toBe(1)
  })

  it('returns 5 for score 20', () => {
    expect(abilityModifier(20)).toBe(5)
  })

  it('returns -1 for score 8', () => {
    expect(abilityModifier(8)).toBe(-1)
  })

  it('returns -1 for score 9', () => {
    expect(abilityModifier(9)).toBe(-1)
  })

  it('returns -5 for score 1', () => {
    expect(abilityModifier(1)).toBe(-5)
  })
})

function makeMonster(overrides: Partial<MonsterData> = {}): MonsterData {
  return {
    slug: 'goblin',
    name: 'Goblin',
    size: 'Small',
    type: 'humanoid',
    alignment: 'neutral evil',
    armor_class: 15,
    armor_desc: 'leather armor',
    hit_points: 7,
    hit_dice: '2d6',
    speed: { walk: 30 },
    strength: 8,
    dexterity: 14,
    constitution: 10,
    intelligence: 10,
    wisdom: 8,
    charisma: 8,
    strength_save: null,
    dexterity_save: null,
    constitution_save: null,
    intelligence_save: null,
    wisdom_save: null,
    charisma_save: null,
    perception: null,
    damage_vulnerabilities: '',
    damage_resistances: '',
    damage_immunities: '',
    condition_immunities: '',
    senses: 'darkvision 60 ft.',
    languages: 'Common, Goblin',
    challenge_rating: '1/4',
    cr: 0.25,
    actions: [],
    special_abilities: [],
    legendary_actions: [],
    reactions: [],
    ...overrides,
  }
}

describe('searchMonsters', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    clearMonsterCache()
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() => {
      return Promise.resolve({ 
        ok: false, 
        status: 400,
        json: async () => ({}),
        text: async () => "",
      }) as Promise<Response>
    }) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
  })

  it('returns empty array for query shorter than 2 chars', async () => {
    const result = await searchMonsters('a')
    expect(result).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns empty array for whitespace-only query', async () => {
    const result = await searchMonsters('   ')
    expect(result).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('fetches monsters and returns mapped results', async () => {
    const goblin = makeMonster()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [goblin] }),
    })

    const result = await searchMonsters('goblin')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toContain('/monsters/')
    expect(mockFetch.mock.calls[0][0]).toContain('search=goblin')
    expect(result).toEqual([
      {
        slug: 'goblin',
        name: 'Goblin',
        challenge_rating: '1/4',
        type: 'humanoid',
        hit_points: 7,
        dexterity: 14,
        armor_class: 15,
      },
    ])
  })

  it('caches full monster data from search results', async () => {
    const goblin = makeMonster()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [goblin] }),
    })

    await searchMonsters('goblin')

    expect(getCachedMonster('goblin')).toEqual(goblin)
  })

  it('throws on non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

    await expect(searchMonsters('goblin')).rejects.toThrow('Open5e search failed: 500')
  })
})

describe('getMonster', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    clearMonsterCache()
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() => {
      return Promise.resolve({ 
        ok: false, 
        status: 400,
        json: async () => ({}),
        text: async () => "",
      }) as Promise<Response>
    }) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
  })

  it('fetches monster by slug and returns data', async () => {
    const goblin = makeMonster()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => goblin,
    })

    const result = await getMonster('goblin')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toContain('/monsters/goblin/')
    expect(result).toEqual(goblin)
  })

  it('caches result and does not fetch again', async () => {
    const goblin = makeMonster()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => goblin,
    })

    await getMonster('goblin')
    const result = await getMonster('goblin')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(goblin)
  })

  it('makes cached data available via getCachedMonster', async () => {
    const goblin = makeMonster()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => goblin,
    })

    await getMonster('goblin')

    expect(getCachedMonster('goblin')).toEqual(goblin)
  })

  it('throws on non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

    await expect(getMonster('goblin')).rejects.toThrow('Open5e fetch failed: 404')
  })
})

describe('getCachedMonster', () => {
  it('returns undefined for unknown slug', () => {
    clearMonsterCache()
    expect(getCachedMonster('unknown')).toBeUndefined()
  })
})
