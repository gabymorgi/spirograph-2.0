import { HYPOTROCHOID_FIXED_RADIUS, PADDING } from './constants'
import { getLaps, getMovingRadius } from './maths'
import { Point } from './types'

export function clipViewBox(points: Point[]): string {
  let minX = points[0].x
  let minY = points[0].y
  let maxX = points[0].x
  let maxY = points[0].y

  points.forEach((point) => {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  })

  const width = maxX - minX + PADDING * 2
  const height = maxY - minY + PADDING * 2
  return `${minX - PADDING} ${minY - PADDING} ${width} ${height}`
}

interface RecalculateViewBoxParams {
  laps: number
  petals: number
  pointDistancePercentage: number
  strokeWidth: number
}

export function recalculateViewBox(spiro: RecalculateViewBoxParams): string {
  const movingRadius = getMovingRadius(
    HYPOTROCHOID_FIXED_RADIUS,
    spiro.petals,
    spiro.laps,
  )
  const max =
    HYPOTROCHOID_FIXED_RADIUS -
    (movingRadius - spiro.pointDistancePercentage) +
    spiro.strokeWidth
  const maxWithPadding = max + PADDING
  const width = maxWithPadding * 2
  const viewBox = `${-maxWithPadding} ${-maxWithPadding} ${width} ${width}`
  return viewBox
}

export function calculateSpirographPoints(
  laps: number,
  petals: number,
  pointDistancePercentage: number,
  pointsPerLap: number,
): Point[] {
  const points: Point[] = []
  const step = (2 * Math.PI) / pointsPerLap

  // const laps = getLaps(HYPOTROCHOID_FIXED_RADIUS, movingRadius)
  const movingRadius = getMovingRadius(HYPOTROCHOID_FIXED_RADIUS, petals, laps)
  const pointDistance = (movingRadius / 100) * pointDistancePercentage
  let max = laps * pointsPerLap

  let t = 0
  for (; max > 0; max--) {
    points.push(
      getHypotrochoidPoint(
        HYPOTROCHOID_FIXED_RADIUS,
        movingRadius,
        pointDistance,
        t,
      ),
    )
    t += step
  }
  return points
}

export function getHypotrochoidPoint(
  fixedRadius: number,
  movingRadius: number,
  pointDistance: number,
  t: number,
  multiplier = 1,
): Point {
  const radiusDifference = fixedRadius - movingRadius
  const radiusRatio = radiusDifference / movingRadius
  const x =
    radiusDifference * Math.cos(t) + pointDistance * Math.cos(radiusRatio * t)
  const y =
    radiusDifference * Math.sin(t) - pointDistance * Math.sin(radiusRatio * t)

  return { x: x * multiplier, y: y * multiplier }
}
