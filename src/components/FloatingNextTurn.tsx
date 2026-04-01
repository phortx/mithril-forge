import { useState, useEffect } from 'react'
import { SkipForward } from 'lucide-react'

type FloatingNextTurnProps = {
  toolbarRef: React.RefObject<HTMLDivElement | null>
  visible: boolean
  onNextTurn: () => void
}

export function FloatingNextTurn({ toolbarRef, visible, onNextTurn }: FloatingNextTurnProps) {
  const [toolbarHidden, setToolbarHidden] = useState(false)

  useEffect(() => {
    if (!visible || !toolbarRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setToolbarHidden(!entry.isIntersecting),
      { threshold: 0 }
    )

    observer.observe(toolbarRef.current)
    return () => observer.disconnect()
  }, [visible, toolbarRef])

  const show = visible && toolbarHidden

  return (
    <button
      onClick={onNextTurn}
      className={`floating-next-turn ${show ? 'floating-next-turn--visible' : ''}`}
      aria-label="Next Turn"
    >
      <SkipForward size={24} />
    </button>
  )
}
