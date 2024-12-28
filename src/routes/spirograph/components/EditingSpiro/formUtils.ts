export function normalizeValue(
  prevValue: number,
  prevMax: number,
  max: number,
) {
  return Math.round((prevValue / (prevMax - 1)) * (max - 1))
}
