import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import type { Creature } from '../types/creature'
import type { TurnState } from '../types/turnState'

export function useTurnTracker(sortedCreatures: Creature[]) {
  const [turnState, setTurnState] = useLocalStorage<TurnState>(
    'mithril-forge-turn',
    null,
  )

  const isStarted = turnState !== null

  const isDead = (c: Creature) => c.hp <= 0 && c.maxHp > 0

  const findFirstAlive = () =>
    sortedCreatures.find((c) => !isDead(c))

  // Handle removed creatures: if the active creature no longer exists, advance
  useEffect(() => {
    if (!turnState) return

    if (sortedCreatures.length === 0) {
      setTurnState(null)
      return
    }

    const activeIndex = sortedCreatures.findIndex(
      (c) => c.id === turnState.activeCreatureId,
    )

    if (activeIndex === -1) {
      const alive = sortedCreatures.find((c) => !isDead(c))
      if (!alive) return
      setTurnState({
        activeCreatureId: alive.id,
        round: turnState.round,
      })
    }
  }, [sortedCreatures, turnState, setTurnState])

  const startEncounter = () => {
    if (sortedCreatures.length === 0) return
    const alive = findFirstAlive()
    if (!alive) return
    setTurnState({ activeCreatureId: alive.id, round: 1 })
  }

  const nextTurn = () => {
    if (!turnState || sortedCreatures.length === 0) return

    const currentIndex = sortedCreatures.findIndex(
      (c) => c.id === turnState.activeCreatureId,
    )

    let nextIndex = (currentIndex + 1) % sortedCreatures.length
    let wraps = nextIndex <= currentIndex
    const startIndex = nextIndex

    while (isDead(sortedCreatures[nextIndex])) {
      if (nextIndex === 0) wraps = true
      nextIndex = (nextIndex + 1) % sortedCreatures.length
      // All creatures dead — don't loop forever
      if (nextIndex === startIndex) return
    }

    setTurnState({
      activeCreatureId: sortedCreatures[nextIndex].id,
      round: wraps ? turnState.round + 1 : turnState.round,
    })
  }

  const endEncounter = () => {
    setTurnState(null)
  }

  return {
    turnState,
    isStarted,
    startEncounter,
    nextTurn,
    endEncounter,
  }
}
