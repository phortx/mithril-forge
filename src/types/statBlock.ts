export type MonsterAction = {
  name: string
  desc: string
  attack_bonus?: number
  damage_dice?: string
}

export type MonsterData = {
  slug: string
  name: string
  size: string
  type: string
  alignment: string
  armor_class: number
  armor_desc: string | null
  hit_points: number
  hit_dice: string
  speed: Record<string, number>
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  strength_save: number | null
  dexterity_save: number | null
  constitution_save: number | null
  intelligence_save: number | null
  wisdom_save: number | null
  charisma_save: number | null
  perception: number | null
  damage_vulnerabilities: string
  damage_resistances: string
  damage_immunities: string
  condition_immunities: string
  senses: string
  languages: string
  challenge_rating: string
  cr: number
  actions: MonsterAction[]
  special_abilities: MonsterAction[]
  legendary_actions: MonsterAction[]
  reactions: MonsterAction[]
}

export type MonsterSearchResult = {
  slug: string
  name: string
  challenge_rating: string
  type: string
  hit_points: number
  dexterity: number
  armor_class: number
}
