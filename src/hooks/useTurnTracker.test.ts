import { renderHook, act } from '@testing-library/react'
import { useTurnTracker } from './useTurnTracker'
import type { Creature } from '../types/creature'

beforeEach(() => {
  localStorage.clear()
})

const makeCreatures = (...names: string[]): Creature[] =>
  names.map((name, i) => ({
    id: `id-${i}`,
    name,
    initiativeModifier: 0,
    initiative: 20 - i,
    creatureType: 'party' as const,
    maxHp: 20,
    hp: 20,
    tempHp: 0,
    monsterSlug: null,
    ac: 10,
  }))

describe('useTurnTracker', () => {
  it('starts with encounter not started', () => {
    const creatures = makeCreatures('A', 'B')
    const { result } = renderHook(() => useTurnTracker(creatures))

    expect(result.current.isStarted).toBe(false)
    expect(result.current.turnState).toBeNull()
  })

  it('starts encounter with first creature active, round 1', () => {
    const creatures = makeCreatures('A', 'B', 'C')
    const { result } = renderHook(() => useTurnTracker(creatures))

    act(() => {
      result.current.startEncounter()
    })

    expect(result.current.isStarted).toBe(true)
    expect(result.current.turnState).toEqual({
      activeCreatureId: 'id-0',
      round: 1,
    })
  })

  it('does nothing when starting with empty creature list', () => {
    const { result } = renderHook(() => useTurnTracker([]))

    act(() => {
      result.current.startEncounter()
    })

    expect(result.current.isStarted).toBe(false)
  })

  it('advances to next creature on nextTurn', () => {
    const creatures = makeCreatures('A', 'B', 'C')
    const { result } = renderHook(() => useTurnTracker(creatures))

    act(() => {
      result.current.startEncounter()
    })
    act(() => {
      result.current.nextTurn()
    })

    expect(result.current.turnState).toEqual({
      activeCreatureId: 'id-1',
      round: 1,
    })
  })

  it('wraps around and increments round', () => {
    const creatures = makeCreatures('A', 'B')
    const { result } = renderHook(() => useTurnTracker(creatures))

    act(() => {
      result.current.startEncounter()
    })
    act(() => {
      result.current.nextTurn()
    })
    // Now at id-1 (last creature), next should wrap
    act(() => {
      result.current.nextTurn()
    })

    expect(result.current.turnState).toEqual({
      activeCreatureId: 'id-0',
      round: 2,
    })
  })

  it('resets on endEncounter', () => {
    const creatures = makeCreatures('A', 'B')
    const { result } = renderHook(() => useTurnTracker(creatures))

    act(() => {
      result.current.startEncounter()
    })
    act(() => {
      result.current.endEncounter()
    })

    expect(result.current.isStarted).toBe(false)
    expect(result.current.turnState).toBeNull()
  })

  it('nextTurn does nothing when encounter not started', () => {
    const creatures = makeCreatures('A', 'B')
    const { result } = renderHook(() => useTurnTracker(creatures))

    act(() => {
      result.current.nextTurn()
    })

    expect(result.current.isStarted).toBe(false)
  })

  it('auto-ends encounter when all creatures are removed', () => {
    const creatures = makeCreatures('A')
    const { result, rerender } = renderHook(
      ({ c }) => useTurnTracker(c),
      { initialProps: { c: creatures } },
    )

    act(() => {
      result.current.startEncounter()
    })

    expect(result.current.isStarted).toBe(true)

    // Remove all creatures
    rerender({ c: [] })

    expect(result.current.isStarted).toBe(false)
  })

  it('recovers when active creature is removed', () => {
    const creatures = makeCreatures('A', 'B', 'C')
    const { result, rerender } = renderHook(
      ({ c }) => useTurnTracker(c),
      { initialProps: { c: creatures } },
    )

    act(() => {
      result.current.startEncounter()
    })
    act(() => {
      result.current.nextTurn()
    })

    // Active is now id-1 (B). Remove B.
    const withoutB = creatures.filter((c) => c.id !== 'id-1')
    rerender({ c: withoutB })

    // Should recover to first creature, same round
    expect(result.current.turnState?.activeCreatureId).toBe('id-0')
    expect(result.current.turnState?.round).toBe(1)
  })

  it('persists turn state to localStorage', () => {
    const creatures = makeCreatures('A', 'B')
    const { result } = renderHook(() => useTurnTracker(creatures))

    act(() => {
      result.current.startEncounter()
    })

    const stored = JSON.parse(
      localStorage.getItem('mithril-forge-turn') ?? 'null',
    )
    expect(stored).toEqual({ activeCreatureId: 'id-0', round: 1 })
  })
})
