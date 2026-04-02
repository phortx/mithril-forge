import { formatModifier } from './formatModifier'

describe('formatModifier', () => {
  it('prefixes positive numbers with +', () => {
    expect(formatModifier(3)).toBe('+3')
  })

  it('prefixes zero with +', () => {
    expect(formatModifier(0)).toBe('+0')
  })

  it('keeps negative sign as-is', () => {
    expect(formatModifier(-2)).toBe('-2')
  })

  it('handles large values', () => {
    expect(formatModifier(10)).toBe('+10')
    expect(formatModifier(-5)).toBe('-5')
  })
})
