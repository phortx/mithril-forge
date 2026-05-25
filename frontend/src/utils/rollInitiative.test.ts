import { rollInitiative } from './rollInitiative'

describe('rollInitiative', () => {
  it('returns 1 + modifier when random returns 0', () => {
    expect(rollInitiative(3, () => 0)).toBe(4)
  })

  it('returns 20 + modifier when random returns 0.95', () => {
    expect(rollInitiative(3, () => 0.95)).toBe(23)
  })

  it('works with negative modifiers', () => {
    expect(rollInitiative(-2, () => 0)).toBe(-1)
  })

  it('works with zero modifier', () => {
    expect(rollInitiative(0, () => 0)).toBe(1)
    expect(rollInitiative(0, () => 0.95)).toBe(20)
  })

  it('returns values in valid range over many rolls', () => {
    const modifier = 5
    for (let i = 0; i < 100; i++) {
      const result = rollInitiative(modifier)
      expect(result).toBeGreaterThanOrEqual(1 + modifier)
      expect(result).toBeLessThanOrEqual(20 + modifier)
    }
  })
})
