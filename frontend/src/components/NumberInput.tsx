import { useState, useRef, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'

type NumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: number | string
  onChange: (value: number | string) => void
  min?: number
  max?: number
  step?: number
  shiftStep?: number
  containerClassName?: string
  onEnter?: (value: number | string) => void
}

export function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  shiftStep = 10,
  className = '',
  containerClassName = '',
  onEnter,
  ...props
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(value.toString())
  const [prevValue, setPrevValue] = useState<number | string>(value)

  if (value !== prevValue) {
    setLocalValue(value.toString())
    setPrevValue(value)
  }

  const commitValue = (newValue: string) => {
    let parsed = parseInt(newValue, 10)
    if (isNaN(parsed)) {
      if (newValue === '' || newValue === '-') {
        onChange('')
        return
      }
      parsed = typeof value === 'number' ? value : 0
    }
    const clamped = Math.max(min, Math.min(max, parsed))
    setLocalValue(clamped.toString())
    onChange(clamped)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    commitValue(localValue)
    props.onBlur?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const current = parseInt(localValue || '0', 10)
      if (!isNaN(current)) {
        const increment = e.shiftKey ? shiftStep : step
        commitValue((current + increment).toString())
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const current = parseInt(localValue || '0', 10)
      if (!isNaN(current)) {
        const decrement = e.shiftKey ? shiftStep : step
        commitValue((current - decrement).toString())
      }
    } else if (e.key === 'Enter') {
      console.log('Enter pressed in NumberInput! localValue:', localValue)
      commitValue(localValue)
      if (onEnter) {
        onEnter(localValue)
      }
    }
    props.onKeyDown?.(e)
  }

  const increment = (e?: React.MouseEvent | React.KeyboardEvent) => {
    const currentStep = e?.shiftKey ? shiftStep : step
    const current = parseInt(localValue || '0', 10)
    if (!isNaN(current)) {
      commitValue((current + currentStep).toString())
    }
  }

  const decrement = (e?: React.MouseEvent | React.KeyboardEvent) => {
    const currentStep = e?.shiftKey ? shiftStep : step
    const current = parseInt(localValue || '0', 10)
    if (!isNaN(current)) {
      commitValue((current - currentStep).toString())
    }
  }

  const [isAltDown, setIsAltDown] = useState(false)
  const dragStartInfo = useRef<{ y: number; val: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Alt') setIsAltDown(true) }
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === 'Alt') setIsAltDown(false) }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    // ensure alt state is cleared when window loses focus
    const handleBlur = () => setIsAltDown(false)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleNativeWheel = (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault()
        const current = parseInt(localValue || '0', 10)
        if (!isNaN(current)) {
          const currentStep = e.shiftKey ? shiftStep : step
          const direction = e.deltaY > 0 ? -1 : 1
          commitValue((current + direction * currentStep).toString())
        }
      }
    }

    container.addEventListener('wheel', handleNativeWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleNativeWheel)
  }, [localValue, shiftStep, step, min, max, value, onChange])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.altKey) {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      const current = parseInt(localValue || '0', 10)
      dragStartInfo.current = {
        y: e.clientY,
        val: isNaN(current) ? 0 : current
      }
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartInfo.current) {
      const deltaY = dragStartInfo.current.y - e.clientY
      const steps = Math.floor(deltaY / 4) // 4 pixels per step
      if (steps !== 0) {
        const currentStep = e.shiftKey ? shiftStep : step
        commitValue((dragStartInfo.current.val + steps * currentStep).toString())
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartInfo.current) {
      e.currentTarget.releasePointerCapture(e.pointerId)
      dragStartInfo.current = null
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center bg-[rgba(13,10,7,0.6)] border border-forge-leather rounded focus-within:border-forge-gold-dim focus-within:ring-1 focus-within:ring-forge-gold/20 transition-all ${isAltDown ? 'cursor-ns-resize' : ''} ${containerClassName}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label={`Decrease ${props['aria-label'] || props.name || props.id || 'value'}`}
        onClick={decrement}
        tabIndex={-1}
        disabled={value !== '' && Number(value) <= min}
        className="px-2 h-full flex items-center text-forge-gold hover:text-forge-gold-bright disabled:text-forge-leather disabled:cursor-default transition-colors shrink-0"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <input
        type="number"
        value={localValue}
        onChange={(e) => {
          const val = e.target.value
          setLocalValue(val)
          
          const parsed = parseInt(val, 10)
          if (!isNaN(parsed)) {
            onChange(parsed)
          } else if (val === '' || val === '-') {
            onChange('')
          }
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full min-w-0 bg-transparent text-center font-body text-forge-parchment-light outline-none tabular-nums placeholder:text-forge-leather ${isAltDown ? 'pointer-events-none' : ''} ${className}`}
        {...props}
      />
      <button
        type="button"
        aria-label={`Increase ${props['aria-label'] || props.name || props.id || 'value'}`}
        onClick={increment}
        tabIndex={-1}
        disabled={value !== '' && Number(value) >= max}
        className="px-2 h-full flex items-center text-forge-gold hover:text-forge-gold-bright disabled:text-forge-leather disabled:cursor-default transition-colors shrink-0"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}
