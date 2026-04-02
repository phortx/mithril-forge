// Liquid color interpolation: green (>60%) → orange (30-60%) → red (<30%)
export function getLiquidColors(percent: number): { top: string; mid: string; bottom: string } {
  if (percent > 60) {
    return { top: '#44cc44', mid: '#228822', bottom: '#0e4a0e' }
  }
  if (percent > 30) {
    // Orange zone
    const t = (percent - 30) / 30 // 0 at 30%, 1 at 60%
    const r = Math.round(204 + t * (68 - 204))  // 204→68
    const g = Math.round(120 + t * (204 - 120))  // 120→204
    const b = Math.round(20 + t * (20 - 20))
    return {
      top: `rgb(${r},${g},${b})`,
      mid: `rgb(${Math.round(r * 0.65)},${Math.round(g * 0.65)},${Math.round(b * 0.65)})`,
      bottom: `rgb(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(b * 0.3)})`,
    }
  }
  return { top: '#cc2828', mid: '#991515', bottom: '#4a0e0e' }
}
