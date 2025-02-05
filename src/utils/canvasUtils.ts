import { PathChunk } from './types'

export function pathChunksToString(chunks: PathChunk[]): string {
  return chunks.map(pathChunkToString).join(' ')
}

export function pathChunkToString(chunk: PathChunk): string {
  const points = chunk.points.map((point) => `${point.x} ${point.y}`).join(' ')
  return `${chunk.command} ${points}`
}

interface PartialSpiroSettings {
  laps: number
  petals: number
  distance: number
}

export function getUniqueSpirographName(spiro: PartialSpiroSettings): string {
  const params = [spiro.petals, spiro.laps, spiro.distance]
  return `Spiro-${params.join('-')}`
}
