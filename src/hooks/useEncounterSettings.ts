import { useLocalStorage } from 'usehooks-ts'
import type { EncounterSettings, HpVisibility } from '../types/encounterSettings'

export function useEncounterSettings() {
  const [settings, setSettings] = useLocalStorage<EncounterSettings>(
    'mithril-forge-settings',
    { hpVisibility: 'party-only' },
  )

  const setHpVisibility = (hpVisibility: HpVisibility) => {
    setSettings((prev) => ({ ...prev, hpVisibility }))
  }

  return { settings, setHpVisibility }
}
