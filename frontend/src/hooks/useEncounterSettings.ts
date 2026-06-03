import { useLocalStorage } from 'usehooks-ts'
import type { EncounterSettings, StatVisibility } from '../types/encounterSettings'

export function useEncounterSettings() {
  const [settings, setSettings] = useLocalStorage<EncounterSettings>(
    'mithril-forge-settings',
    { statVisibility: 'party-only', animationsEnabled: true },
  )

  const setStatVisibility = (statVisibility: StatVisibility) => {
    setSettings((prev) => ({ ...prev, statVisibility }))
  }

  const setAnimationsEnabled = (animationsEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, animationsEnabled }))
  }

  return { settings, setStatVisibility, setAnimationsEnabled }
}
