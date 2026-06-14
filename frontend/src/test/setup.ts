import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, expect, mock } from 'bun:test'
import * as matchers from '@testing-library/jest-dom/matchers'

GlobalRegistrator.register()
expect.extend(matchers as Parameters<typeof expect.extend>[0])

mock.module('posthog-js', () => ({
  default: {
    init: mock(),
    capture: mock(),
    identify: mock(),
    reset: mock(),
  }
}))

// usehooks-ts' `useLocalStorage` dispatches a custom "local-storage" event on
// `window` to synchronise multiple hooks of the same key within one window.
// Across tests, hooks from earlier tests linger (React roots aren't unmounted
// until GC and @testing-library's cleanup() destabilises happy-dom). When a
// later test calls setItem, those zombies receive the event and — if their
// captured `sortedCreatures` happens to be `[]` — their useEffect writes
// `setTurnState(null)` back into localStorage, corrupting the current test.
// We don't need cross-hook sync in tests (one window, one hook per key), so
// suppressing this custom event removes the pollution channel.
const origDispatchEvent = window.dispatchEvent.bind(window)
window.dispatchEvent = (event: Event): boolean => {
  if (event.type === 'local-storage') return true
  return origDispatchEvent(event)
}

afterEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
})

