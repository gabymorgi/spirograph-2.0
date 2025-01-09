import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from "../../../utils/constants"
import { getHypotrochoidPoint } from "../../../utils/functions"
import { getMovingRadius } from "../../../utils/maths"
import { Point } from "../../../utils/types"

const epsilon = 1e-9; // Tolerancia para comparación

export function getSizeRadiusFunction(r: number): [Point[], Point[]] {
  if (r === 0) {
    return [[{ x: 0, y: 0 }, { x: 1, y: 0 }], [{ x: 0, y: 0 }, { x: 1, y: 0 }]]
  }
  const step = 5
  const points1: Point[] = []
  const points2: Point[] = []
  for (let i = 0; i <= 100; i += step) {
    const sizes = getSizesRadius(r, i)
    points1.push({ x: i, y: sizes[0] })
    points2.push({ x: i, y: sizes[1] })
  }
  return [points1, points2]
}

export function getSizesRadius(
  r: number,
  pointDistancePercentage: number,
): [number, number] {
  const fixedRadius = HYPOTROCHOID_FIXED_RADIUS
  const movingRadius = r
  // const laps = getLaps(fixedRadius, movingRadius)
  // const petals = getPetalsAmount(fixedRadius, movingRadius)
  const pointDistance = (movingRadius / 100) * pointDistancePercentage

  let step = (movingRadius * Math.PI) / fixedRadius
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
  return [
    Zy - Zx * Math.tan(theta),
    Zx/Math.cos(theta),
  ]
}

export function getSizeFunction(petals: number, laps: number): [Point[], Point[]] {
  const step = 5
  const points1: Point[] = []
  const points2: Point[] = []
  for (let i = 0; i <= 100; i += step) {
    const sizes = getSizes(laps, petals, i)
    points1.push({ x: i, y: sizes[0] })
    points2.push({ x: i, y: sizes[1] })
  }
  return [points1, points2]
}

export function getSizes(
  laps: number,
  petals: number,
  pointDistancePercentage: number,
): [number, number] {
  const fixedRadius = HYPOTROCHOID_FIXED_RADIUS
  const movingRadius = getMovingRadius(fixedRadius, petals, laps)
  const pointDistance = (movingRadius / 100) * pointDistancePercentage

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
  return [
    Zy - Zx * Math.tan(theta),
    Zx/Math.cos(theta),
  ]
}

type Line = { m: number; b: number };
export function getLineParams(points: Point[]): Line {
  if (points.length < 2) {
    throw new Error("Se necesitan al menos dos puntos para determinar una recta.");
  }

  const firstPoint = points[0];
  const secondPoint = points[1];

  // Calculamos la pendiente entre los dos primeros puntos
  const deltaX = secondPoint.x - firstPoint.x;
  const deltaY = secondPoint.y - firstPoint.y;

  // Si deltaX es 0, la pendiente es infinita (recta vertical)
  let m: number = deltaX === 0 ? Infinity : deltaY / deltaX;

  for (let i = 2; i < points.length; i++) {
    const currentDeltaX = points[i].x - firstPoint.x;
    const currentDeltaY = points[i].y - firstPoint.y;

    // Verificamos la pendiente con el punto actual
    if (currentDeltaX === 0 && m !== null) {
      throw new Error('Inconsistencia: un punto genera pendiente infinita, otro no');
    } else if (currentDeltaX !== 0) {
      const currentM = currentDeltaY / currentDeltaX;
      if (m !== null && Math.abs(currentM - m) > epsilon) {
        throw new Error('Las pendientes no coinciden');
      }
    }
  }

  // Calculamos c (intersección con el eje y) si no es una recta vertical
  let b = firstPoint.y - m * firstPoint.x

  return { m, b };
}

export function getMagicNumbers(r: number) {
  const lineParams1 = getLineParams([{ x: 0, y: getSizesRadius(r, 0)[0] }, { x: 100, y: getSizesRadius(r, 100)[0] }])

  return {
    r,
    b: lineParams1.b,
    m: -lineParams1.m
  }
}

