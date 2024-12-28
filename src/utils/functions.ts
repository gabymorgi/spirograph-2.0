import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS, PADDING } from './constants'
import { getMovingRadius } from './maths'
import { PathChunk, Point } from './types'

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
  strokeWidthPercentage: number
}

export function recalculateViewBox(spiro: RecalculateViewBoxParams): string {
  const movingRadius = getMovingRadius(
    HYPOTROCHOID_FIXED_RADIUS,
    spiro.petals,
    spiro.laps,
  )
  const max =
    HYPOTROCHOID_FIXED_RADIUS -
    movingRadius * (1 - spiro.pointDistancePercentage * 0.01)
  const maxWithPadding = max + PADDING
  const width = maxWithPadding * 2
  const viewBox = `${-maxWithPadding} ${-maxWithPadding} ${width} ${width}`
  return viewBox
}

export function getAwesomeSpiro(
  laps: number,
  petals: number,
  pointDistancePercentage: number,
): PathChunk[] {
  const fixedRadius = HYPOTROCHOID_FIXED_RADIUS
  const movingRadius = getMovingRadius(fixedRadius, petals, laps)
  const pointDistance = (movingRadius / 100) * pointDistancePercentage
  let isInverted = pointDistance > fixedRadius - movingRadius

  let step = (laps * Math.PI) / petals
  const samplingStep = step / 2
  
  const points: Point[] = []
  for (let i = 0; i <= 2; i++) {
    points.push(getHypotrochoidPoint(
      fixedRadius,
      movingRadius,
      pointDistance,
      samplingStep * i,
    ))
  }
  const theta = step - HALF_PI
  const Zx = 4/3 * (2 * points[1].x - points[0].x - points[2].x)
  const Zy = 4/3 * (2 * points[1].y - points[0].y - points[2].y)
  const sizes = [
    Zy - Zx * Math.tan(theta),
    Zx/Math.cos(theta),
  ]
  
  const invertedSizes = [sizes[1], sizes[0]]

  const maxRadius = HYPOTROCHOID_FIXED_RADIUS - movingRadius + pointDistance
  let minRadius = HYPOTROCHOID_FIXED_RADIUS - movingRadius - pointDistance

  let prevPoint: Point = { x: maxRadius, y: 0 }
  let prevStep = 0
  const commands: PathChunk[] = [{ command: 'M', points: [prevPoint] }]
  let isEven = true
  
  if (isInverted) {
    step -= Math.PI
    minRadius = -minRadius
  }
  let t = step
  for (let i = petals * 2; i > 0; i--) {
    
    const usedSizes = isEven ? sizes : invertedSizes
    const usedRadius = isEven ? minRadius : maxRadius
    const cp1Angle = isInverted && !isEven ? prevStep - HALF_PI : prevStep + HALF_PI
    const newPoint: Point = {
      x: usedRadius * Math.cos(t),
      y: usedRadius * Math.sin(t),
    }
    const CP1: Point = {
      x: prevPoint.x + usedSizes[0] * Math.cos(cp1Angle),
      y: prevPoint.y + usedSizes[0] * Math.sin(cp1Angle),
    }
    const cp2Angle = isInverted && isEven ? t + HALF_PI : t - HALF_PI
    const CP2: Point = {
      x: newPoint.x + usedSizes[1] * Math.cos(cp2Angle),
      y: newPoint.y + usedSizes[1] * Math.sin(cp2Angle),
    }
    commands.push({
      command: 'C',
      points: [
        CP1,
        CP2,
        newPoint,
      ],
    })
    prevPoint = newPoint
    prevStep = t
    isEven = !isEven
    t += step
  }
  commands.push({
    command: 'Z',
    points: [],
  })
  return commands
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
