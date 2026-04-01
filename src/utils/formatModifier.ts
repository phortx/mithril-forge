export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}
