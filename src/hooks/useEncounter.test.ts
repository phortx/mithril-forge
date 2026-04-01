import { renderHook, act } from '@testing-library/react'
import { useEncounter } from './useEncounter'

beforeEach(() => {
  localStorage.clear()
})

describe('useEncounter', () => {
  it('starts with an empty creature list', () => {
    const { result } = renderHook(() => useEncounter())

    expect(result.current.creatures).toEqual([])
  })

  it('adds a creature with initiative null', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })

    expect(result.current.creatures).toHaveLength(1)
    expect(result.current.creatures[0]).toMatchObject({
      name: 'Goblin',
      initiativeModifier: 2,
      initiative: null,
    })
    expect(result.current.creatures[0].id).toBeDefined()
  })

  it('adds multiple creatures', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })
    act(() => {
      result.current.addCreature('Dragon', -1)
    })

    expect(result.current.creatures).toHaveLength(2)
    expect(result.current.creatures[0].name).toBe('Goblin')
    expect(result.current.creatures[1].name).toBe('Dragon')
  })

  it('removes a creature by id', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })
    act(() => {
      result.current.addCreature('Dragon', -1)
    })

    const goblinId = result.current.creatures[0].id

    act(() => {
      result.current.removeCreature(goblinId)
    })

    expect(result.current.creatures).toHaveLength(1)
    expect(result.current.creatures[0].name).toBe('Dragon')
  })

  it('generates unique ids for each creature', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin A', 0)
    })
    act(() => {
      result.current.addCreature('Goblin B', 0)
    })

    const ids = result.current.creatures.map((c) => c.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('persists creatures to localStorage', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })

    const stored = JSON.parse(
      localStorage.getItem('mithril-forge-encounter') ?? '[]',
    )
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('Goblin')
  })

  it('does nothing when removing a non-existent id', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })
    act(() => {
      result.current.removeCreature('non-existent-id')
    })

    expect(result.current.creatures).toHaveLength(1)
  })

  it('rolls initiative for a single creature', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })

    const id = result.current.creatures[0].id

    act(() => {
      result.current.rollCreatureInitiative(id)
    })

    const initiative = result.current.creatures[0].initiative
    expect(initiative).not.toBeNull()
    expect(initiative).toBeGreaterThanOrEqual(3)
    expect(initiative).toBeLessThanOrEqual(22)
  })

  it('rolls initiative for all creatures without one', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })
    act(() => {
      result.current.addCreature('Dragon', -1)
    })

    // Manually set initiative on one creature
    const goblinId = result.current.creatures[0].id
    act(() => {
      result.current.updateCreature(goblinId, { initiative: 15 })
    })

    act(() => {
      result.current.rollAllInitiative()
    })

    // Goblin keeps its manually set initiative
    const goblin = result.current.creatures.find((c) => c.id === goblinId)!
    expect(goblin.initiative).toBe(15)

    // Dragon gets a rolled initiative
    const dragon = result.current.creatures.find(
      (c) => c.name === 'Dragon',
    )!
    expect(dragon.initiative).not.toBeNull()
  })

  it('manually updates initiative', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })

    const id = result.current.creatures[0].id

    act(() => {
      result.current.updateCreature(id, { initiative: 18 })
    })

    expect(result.current.creatures[0].initiative).toBe(18)
  })

  it('sorts creatures by initiative descending, nulls last', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Low', 0)
    })
    act(() => {
      result.current.addCreature('High', 0)
    })
    act(() => {
      result.current.addCreature('Unrolled', 0)
    })

    const lowId = result.current.creatures[0].id
    const highId = result.current.creatures[1].id

    act(() => {
      result.current.updateCreature(lowId, { initiative: 5 })
    })
    act(() => {
      result.current.updateCreature(highId, { initiative: 20 })
    })

    expect(result.current.creatures[0].name).toBe('High')
    expect(result.current.creatures[1].name).toBe('Low')
    expect(result.current.creatures[2].name).toBe('Unrolled')
    expect(result.current.creatures[2].initiative).toBeNull()
  })
})
