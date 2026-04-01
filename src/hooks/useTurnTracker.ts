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
      setTurnState({
        activeCreatureId: sortedCreatures[0].id,
        round: turnState.round,
      })
    }
  }, [sortedCreatures, turnState, setTurnState])

  const startEncounter = () => {
    if (sortedCreatures.length === 0) return
    setTurnState({ activeCreatureId: sortedCreatures[0].id, round: 1 })
  }

  const nextTurn = () => {
    if (!turnState || sortedCreatures.length === 0) return

    const currentIndex = sortedCreatures.findIndex(
      (c) => c.id === turnState.activeCreatureId,
    )
    const nextIndex = (currentIndex + 1) % sortedCreatures.length
    const wraps = nextIndex === 0

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
