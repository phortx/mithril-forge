const SECONDS_PER_ROUND = 6

export function formatInGameTime(round: number): string {
  const totalSeconds = (round - 1) * SECONDS_PER_ROUND
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) return `${seconds}s`
  if (seconds === 0) return `${minutes}min`
  return `${minutes}min ${seconds}s`
}
