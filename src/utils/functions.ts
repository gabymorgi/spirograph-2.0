import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from './constants'
import { getMovingRadius } from './maths'
import { PathChunk, Point, SpiroParams } from './types'
import { bCoef, mCoef } from './data.json'
import { polinomicFunction } from '@/routes/spirograph/test/polinomic'
import { lerp } from '@/routes/spirograph/fn'

export function getAwesomeSpiro(
  laps: number,
  petals: number,
  distance: number,
): PathChunk[] {
  const fixedRadius = HYPOTROCHOID_FIXED_RADIUS
  const movingRadius = getMovingRadius(fixedRadius, petals, laps)
  const pointDistance = movingRadius * distance
  const isInverted = pointDistance > fixedRadius - movingRadius

  let step = (laps * Math.PI) / petals
  const samplingStep = step / 2

  const points: Point[] = []
  for (let i = 0; i <= 2; i++) {
    points.push(
      getHypotrochoidPoint(
        fixedRadius,
        movingRadius,
        pointDistance,
        samplingStep * i,
      ),
    )
  }
  const theta = step - HALF_PI
  const Zx = (4 / 3) * (2 * points[1].x - points[0].x - points[2].x)
  const Zy = (4 / 3) * (2 * points[1].y - points[0].y - points[2].y)
  const sizes = [Zy - Zx * Math.tan(theta), Zx / Math.cos(theta)]

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
    const cp1Angle =
      isInverted && !isEven ? prevStep - HALF_PI : prevStep + HALF_PI
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
      points: [CP1, CP2, newPoint],
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

export function normalizeKeyPoints(
  keyPoints: Point[],
  limits: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  },
): Point[] {
  // Obtener los valores mínimos y máximos de x e y
  // const drawnPoint = keyPoints.filter((_, i) => i % 3 === 1)
  // const xValues = drawnPoint.map(p => p.x);
  // const yValues = drawnPoint.map(p => p.y);

  const xMin = limits.minX //Math.min(...xValues);
  const xMax = limits.maxX //Math.max(...xValues);
  const yMin = limits.minY //Math.min(...yValues);
  const yMax = limits.maxY //Math.max(...yValues);

  // Calcular los rangos
  const xRange = xMax - xMin
  const yRange = yMax - yMin

  // Determinar el rango dominante (el mayor entre xRange e yRange)
  const dominantRange = Math.max(xRange, yRange)

  // Normalizar los puntos
  return keyPoints.map((point) => {
    const normalizedX = ((point.x - xMin) / xRange) * 2 - 1 // Normalizar x a [-1, 1]
    const normalizedY = ((point.y - yMin) / yRange) * 2 - 1 // Normalizar y a [-1, 1]

    // Ajustar el valor menor para preservar la relación de aspecto
    if (dominantRange === xRange) {
      return { x: normalizedX, y: normalizedY * (yRange / xRange) }
    } else {
      return { x: normalizedX * (xRange / yRange), y: normalizedY }
    }
  })
}

const CACHE_SIZE = 100
const cache = new Map<string, SpiroParams>()

export function getSpiroParams(p: number, l: number, d: number): SpiroParams {
  const cacheKey = `${p}-${l}-${d}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }

  const radius = getMovingRadius(HYPOTROCHOID_FIXED_RADIUS, p, l)
  const innerDataB =
    radius < 60
      ? polinomicFunction(bCoef, radius)
      : polinomicFunction(mCoef, 120 - radius)
  const innerDataM =
    radius < 60
      ? polinomicFunction(mCoef, radius)
      : polinomicFunction(bCoef, 120 - radius)
  const maxSize = innerDataB - innerDataM * d
  const minSize = innerDataB + innerDataM * d

  const pointDistance = radius * d
  const maxRadius = HYPOTROCHOID_FIXED_RADIUS - radius + pointDistance
  const minRadius = HYPOTROCHOID_FIXED_RADIUS - radius - pointDistance

  const step = (l * Math.PI) / p

  const result: SpiroParams = {
    petals: p,
    laps: l,
    minRadius: minRadius / maxRadius,
    maxRadius: 1,
    minSize: minSize / maxRadius,
    maxSize: maxSize / maxRadius,
    stepAngle: step,
    anglesAmount: p * 2 + 1,
  }

  cache.set(cacheKey, result)

  if (cache.size > CACHE_SIZE) {
    const firstKey = cache.keys().next().value!
    cache.delete(firstKey)
  }

  return result
}

export function getKeyPoints(
  params: SpiroParams,
  from: number = 0,
  parity: 0 | 1 = 0,
): Point[] {
  const { minRadius, maxRadius, minSize, maxSize, stepAngle, anglesAmount } =
    params
  const keyPoints: Point[] = []

  // calculate each point and the control points attached to it
  let angle = from
  for (let i = 0; i < anglesAmount; i++) {
    const radius = i % 2 === parity ? minRadius : maxRadius
    const size = i % 2 === parity ? minSize : maxSize

    const point = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    }

    keyPoints.push(
      {
        x: size * Math.cos(angle - HALF_PI) + point.x,
        y: size * Math.sin(angle - HALF_PI) + point.y,
      },
      point,
      {
        x: size * Math.cos(angle + HALF_PI) + point.x,
        y: size * Math.sin(angle + HALF_PI) + point.y,
      },
    )

    angle += stepAngle
  }

  return keyPoints
}

export function getPath(keyPoints: Point[], isClosed?: boolean): PathChunk[] {
  const pathChunks: PathChunk[] = []
  pathChunks.push({
    command: 'M',
    points: [keyPoints[1]], // pos 0 has a control point
  })

  // create the path chunks with the control points related to path, not the points
  for (let i = 2; i < keyPoints.length - 1; i += 3) {
    pathChunks.push({
      command: 'C',
      points: keyPoints.slice(i, i + 3),
    })
  }

  if (isClosed) {
    pathChunks.push({
      command: 'C',
      points: [keyPoints[keyPoints.length - 1], keyPoints[0], keyPoints[1]],
    })
  }

  return pathChunks
}

function SpiroLerp(
  pre: SpiroParams,
  post: SpiroParams,
  t: number,
): SpiroParams {
  return {
    minRadius: lerp(pre.minRadius, post.minRadius, t),
    maxRadius: lerp(pre.maxRadius, post.maxRadius, t),
    minSize: lerp(pre.minSize, post.minSize, t),
    maxSize: lerp(pre.maxSize, post.maxSize, t),
    stepAngle: lerp(pre.stepAngle, post.stepAngle, t),
    anglesAmount: Math.min(pre.anglesAmount, post.anglesAmount),
  }
}

export function getSpiroTransition(
  pre: SpiroParams,
  post: SpiroParams,
  t: number,
): PathChunk[] {
  const actParams = SpiroLerp(pre, post, t)
  const keyPoints = getKeyPoints(actParams)

  const calculateExtraParams = (isIncreasing: boolean) => {
    const isClockwise = post.minRadius > 0
    return {
      minRadius: lerp(pre.minRadius, post.minRadius, t),
      maxRadius: isClockwise
        ? isIncreasing
          ? lerp(pre.minRadius, 1, t)
          : lerp(1, post.minRadius, t)
        : isIncreasing
          ? lerp(-pre.minRadius, 1, t)
          : lerp(1, -post.minRadius, t),
      minSize: isIncreasing
        ? lerp(0, post.minSize, t)
        : lerp(pre.minSize, 0, t),
      maxSize: isIncreasing
        ? lerp(0, post.maxSize, t)
        : lerp(pre.maxSize, 0, t),
      stepAngle: isClockwise
        ? isIncreasing
          ? lerp(0, post.stepAngle, t)
          : lerp(pre.stepAngle, 0, t)
        : isIncreasing
          ? lerp(Math.PI, post.stepAngle, t)
          : lerp(pre.stepAngle, Math.PI, t),
      anglesAmount:
        Math.max(pre.anglesAmount, post.anglesAmount) -
        actParams.anglesAmount +
        1,
    }
  }

  if (pre.anglesAmount !== post.anglesAmount) {
    const isIncreasing = pre.anglesAmount < post.anglesAmount
    const extraParams = calculateExtraParams(isIncreasing)
    const extraKeyPoints = getKeyPoints(
      extraParams,
      (actParams.anglesAmount - 1) * actParams.stepAngle,
    )
    keyPoints.pop()
    keyPoints.push(...extraKeyPoints.slice(2))
  }

  const path = getPath(keyPoints, false)
  return path
}

type requiredSpiroParams = Required<SpiroParams>

export function getTransitionDuration(
  pre: requiredSpiroParams,
  post: requiredSpiroParams,
): number {
  let duration = pre.petals === post.petals ? 0 : 1
  if (pre.minRadius !== post.minRadius) {
    duration = Math.max(duration, Math.abs(post.minRadius - pre.minRadius))
  }
  if (pre.petals !== post.petals) {
    if (pre.laps < pre.petals / 2 || post.laps < post.petals / 2) {
      duration = Math.max(duration, Math.abs(pre.laps - post.laps))
    } else {
      duration = Math.max(
        duration,
        Math.abs(pre.petals - pre.laps - post.petals + post.laps),
      )
    }
  } else if (pre.laps !== post.laps) {
    duration = Math.max(duration, Math.abs(pre.laps - post.laps))
  }

  return duration * 1000
}
