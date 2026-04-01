import { formatInGameTime } from './formatInGameTime'

describe('formatInGameTime', () => {
  it('shows 0s for round 1', () => {
    expect(formatInGameTime(1)).toBe('0s')
  })

  it('shows 6s for round 2', () => {
    expect(formatInGameTime(2)).toBe('6s')
  })

  it('shows 54s for round 10', () => {
    expect(formatInGameTime(10)).toBe('54s')
  })

  it('shows 1min for round 11', () => {
    expect(formatInGameTime(11)).toBe('1min')
  })

  it('shows 1min 6s for round 12', () => {
    expect(formatInGameTime(12)).toBe('1min 6s')
  })

  it('shows 10min for round 101', () => {
    expect(formatInGameTime(101)).toBe('10min')
  })
})
