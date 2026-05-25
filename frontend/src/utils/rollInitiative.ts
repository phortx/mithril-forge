export function rollInitiative(
  modifier: number,
  random: () => number = Math.random,
): number {
  const d20 = Math.floor(random() * 20) + 1
  return d20 + modifier
}
