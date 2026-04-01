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

  it('adds a creature', () => {
    const { result } = renderHook(() => useEncounter())

    act(() => {
      result.current.addCreature('Goblin', 2)
    })

    expect(result.current.creatures).toHaveLength(1)
    expect(result.current.creatures[0]).toMatchObject({
      name: 'Goblin',
      initiativeModifier: 2,
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
})
