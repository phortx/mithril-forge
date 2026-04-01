import { useLocalStorage } from 'usehooks-ts'
import type { EncounterSettings, StatVisibility } from '../types/encounterSettings'

export function useEncounterSettings() {
  const [settings, setSettings] = useLocalStorage<EncounterSettings>(
    'mithril-forge-settings',
    { statVisibility: 'party-only' },
  )

  const setStatVisibility = (statVisibility: StatVisibility) => {
    setSettings((prev) => ({ ...prev, statVisibility }))
  }

  return { settings, setStatVisibility }
}
