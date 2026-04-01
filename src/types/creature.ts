export type CreatureType = 'party' | 'enemy'

export type Creature = {
  id: string
  name: string
  initiativeModifier: number
  initiative: number | null
  creatureType: CreatureType
  maxHp: number
  hp: number
  tempHp: number
}
