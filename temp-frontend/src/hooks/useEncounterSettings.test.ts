import { renderHook, act } from '@testing-library/react'
import { useEncounterSettings } from './useEncounterSettings'

beforeEach(() => {
  localStorage.clear()
})

describe('useEncounterSettings', () => {
  it('defaults to party-only stat visibility', () => {
    const { result } = renderHook(() => useEncounterSettings())

    expect(result.current.settings.statVisibility).toBe('party-only')
  })

  it('sets stat visibility to all', () => {
    const { result } = renderHook(() => useEncounterSettings())

    act(() => {
      result.current.setStatVisibility('all')
    })

    expect(result.current.settings.statVisibility).toBe('all')
  })

  it('sets stat visibility to none', () => {
    const { result } = renderHook(() => useEncounterSettings())

    act(() => {
      result.current.setStatVisibility('none')
    })

    expect(result.current.settings.statVisibility).toBe('none')
  })

  it('persists settings to localStorage', () => {
    const { result, unmount } = renderHook(() => useEncounterSettings())

    act(() => {
      result.current.setStatVisibility('all')
    })

    unmount()

    const { result: result2 } = renderHook(() => useEncounterSettings())
    expect(result2.current.settings.statVisibility).toBe('all')
  })
})
