import { getLiquidColors } from './HealthBar'

describe('getLiquidColors', () => {
  it('returns green for health above 60%', () => {
    expect(getLiquidColors(80)).toEqual({
      top: '#44cc44',
      mid: '#228822',
      bottom: '#0e4a0e',
    })
  })

  it('returns green at 61% (boundary)', () => {
    expect(getLiquidColors(61)).toEqual({
      top: '#44cc44',
      mid: '#228822',
      bottom: '#0e4a0e',
    })
  })

  it('returns red for health at or below 30%', () => {
    expect(getLiquidColors(30)).toEqual({
      top: '#cc2828',
      mid: '#991515',
      bottom: '#4a0e0e',
    })
  })

  it('returns red at 0%', () => {
    expect(getLiquidColors(0)).toEqual({
      top: '#cc2828',
      mid: '#991515',
      bottom: '#4a0e0e',
    })
  })

  it('returns green at 100%', () => {
    expect(getLiquidColors(100)).toEqual({
      top: '#44cc44',
      mid: '#228822',
      bottom: '#0e4a0e',
    })
  })

  it('interpolates orange zone at 45% (midpoint)', () => {
    // t = (45 - 30) / 30 = 0.5
    // r = round(204 + 0.5 * (68 - 204)) = 136
    // g = round(120 + 0.5 * (204 - 120)) = 162
    // b = round(20 + 0.5 * 0) = 20
    const colors = getLiquidColors(45)
    expect(colors.top).toBe('rgb(136,162,20)')
    expect(colors.mid).toBe('rgb(88,105,13)')
    expect(colors.bottom).toBe('rgb(41,49,6)')
  })

  it('interpolates at 60% (top of orange zone, t=1)', () => {
    // t = (60 - 30) / 30 = 1.0
    // r = round(204 + 1 * -136) = 68
    // g = round(120 + 1 * 84) = 204
    // b = 20
    const colors = getLiquidColors(60)
    expect(colors.top).toBe('rgb(68,204,20)')
    expect(colors.mid).toBe('rgb(44,133,13)')
    expect(colors.bottom).toBe('rgb(20,61,6)')
  })

  it('interpolates at 31% (bottom of orange zone, t≈0.03)', () => {
    // t = (31 - 30) / 30 ≈ 0.0333
    // r = round(204 + 0.0333 * -136) = round(199.47) = 199
    // g = round(120 + 0.0333 * 84) = round(122.8) = 123
    // b = 20
    const colors = getLiquidColors(31)
    expect(colors.top).toBe('rgb(199,123,20)')
  })
})
