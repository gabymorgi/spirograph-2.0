import { derivativeOnPoint, getLineIntersection } from './maths'
import { Interpolation, PathChunk, Point } from './types'

export function pathChunksToString(chunks: PathChunk[]): string {
  return chunks.map(pathChunkToString).join(' ')
}

export function pathChunkToString(chunk: PathChunk): string {
  const points = chunk.points.map((point) => `${point.x} ${point.y}`).join(' ')
  return `${chunk.command} ${points}`
}

export function getPath(
  points: Point[],
  interpolation: Interpolation,
): PathChunk[] {
  switch (interpolation) {
    case Interpolation.Linear:
      return getLinearPath(points)
    case Interpolation.Bezier:
      return getBezierPath(points)
    case Interpolation.Derivative:
      return getDerivativePath(points)
    default:
      throw new Error('Invalid interpolation')
  }
}

function getLinearPath(points: Point[]): PathChunk[] {
  if (points.length < 2) {
    throw new Error('Not enough points')
  }
  const pathParts: PathChunk[] = [{ command: 'M', points: [points[0]] }]
  for (let i = 1; i < points.length; i++) {
    pathParts.push({ command: 'L', points: [points[i]] })
  }
  // add the point to close the path
  pathParts.push({ command: 'Z', points: [] })
  return pathParts
}

function getBezierPath(points: Point[]): PathChunk[] {
  if (points.length < 3) {
    throw new Error('Not enough points')
  }
  const pathParts: PathChunk[] = [{ command: 'M', points: [points[0]] }]
  for (let i = 1; i < points.length; i++) {
    const P0 = points[i - 2] || points[points.length - 1]
    const P1 = points[i - 1]
    const P2 = points[i]
    pathParts.push(getBezierPoint(P0, P1, P2))
  }
  // add las point to close the path
  pathParts.push(
    getBezierPoint(
      points[points.length - 2],
      points[points.length - 1],
      points[0],
    ),
  )
  pathParts.push({ command: 'Z', points: [] })
  return pathParts
}

function getBezierPoint(P0: Point, P1: Point, P2: Point): PathChunk {
  const ControlPoint = {
    x: P1.x + P2.x * 0.25 - P0.x * 0.25,
    y: P1.y + P2.y * 0.25 - P0.y * 0.25,
  }
  return { command: 'Q', points: [ControlPoint, P2] }
}

function getDerivativePath(points: Point[]): PathChunk[] {
  if (points.length < 4) {
    throw new Error('Not enough points')
  }
  const pathParts: PathChunk[] = [{ command: 'M', points: [points[0]] }]
  for (let i = 1; i < points.length; i++) {
    const P0 = points[i - 2] || points[points.length - 1]
    const P1 = points[i - 1]
    const P2 = points[i]
    const P3 = points[i + 1] || points[0]
    pathParts.push(getDerivativePoint(P0, P1, P2, P3))
  }
  // add las point to close the path
  pathParts.push(
    getDerivativePoint(
      points[points.length - 2],
      points[points.length - 1],
      points[0],
      points[1],
    ),
  )
  pathParts.push({ command: 'Z', points: [] })
  return pathParts
}

function getDerivativePoint(
  P0: Point,
  P1: Point,
  P2: Point,
  P3: Point,
): PathChunk {
  const Line1 = {
    point: P1,
    slope: derivativeOnPoint(P0, P2),
  }
  const Line2 = {
    point: P2,
    slope: derivativeOnPoint(P1, P3),
  }
  const ControlPoint = getLineIntersection(Line1, Line2)

  // Calculate the bounding box
  const minX = Math.min(P1.x, P2.x)
  const maxX = Math.max(P1.x, P2.x)
  const minY = Math.min(P1.y, P2.y)
  const maxY = Math.max(P1.y, P2.y)

  if (
    (ControlPoint.x < minX && ControlPoint.y < minY) ||
    (ControlPoint.x > maxX && ControlPoint.y > maxY) ||
    (ControlPoint.x < minX && ControlPoint.y > maxY) ||
    (ControlPoint.x > maxX && ControlPoint.y < minY)
  ) {
    // The control point is outside the bounding box
    // so we simply return a linear path
    return { command: 'L', points: [P2] }
  }

  return { command: 'Q', points: [ControlPoint, P2] }
}

interface PartialSpiroSettings {
  laps: number
  petals: number
  pointDistancePercentage: number
}

export function getUniqueSpirographName(spiro: PartialSpiroSettings): string {
  const params = [spiro.petals, spiro.laps, spiro.pointDistancePercentage]
  return `Spiro-${params.join('-')}`
}
