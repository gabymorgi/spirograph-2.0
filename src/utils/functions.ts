import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from './constants'
import { getMovingRadius } from './maths'
import { PathChunk, Point } from './types'

export function getAwesomeSpiro(
  laps: number,
  petals: number,
  distance: number,
): PathChunk[] {
  const fixedRadius = HYPOTROCHOID_FIXED_RADIUS
  const movingRadius = getMovingRadius(fixedRadius, petals, laps)
  const pointDistance = movingRadius * distance
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
