import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from "../../../utils/constants"
import { getHypotrochoidPoint } from "../../../utils/functions"
import { getMovingRadius } from "../../../utils/maths"
import { PathChunk, Point } from "../../../utils/types"

const epsilon = 1e-9; // Tolerancia para comparación

export function checkCollinearityAndLineParams(points: Point[]): { isCollinear: boolean; m?: number; c?: number } {
  if (points.length < 2) {
    throw new Error("Se necesitan al menos dos puntos para determinar una recta.");
  }

  const firstPoint = points[0];
  const secondPoint = points[1];

  // Calculamos la pendiente entre los dos primeros puntos
  const deltaX = secondPoint.x - firstPoint.x;
  const deltaY = secondPoint.y - firstPoint.y;

  // Si deltaX es 0, la pendiente es infinita (recta vertical)
  let m: number | null = deltaX === 0 ? null : deltaY / deltaX;

  for (let i = 2; i < points.length; i++) {
    const currentDeltaX = points[i].x - firstPoint.x;
    const currentDeltaY = points[i].y - firstPoint.y;

    // Verificamos la pendiente con el punto actual
    if (currentDeltaX === 0 && m !== null) {
      return { isCollinear: false }; // Inconsistencia: un punto genera pendiente infinita, otro no
    } else if (currentDeltaX !== 0) {
      const currentM = currentDeltaY / currentDeltaX;
      if (m !== null && Math.abs(currentM - m) > epsilon) {
        return { isCollinear: false }; // Las pendientes no coinciden
      }
    }
  }

  // Calculamos c (intersección con el eje y) si no es una recta vertical
  let c: number | undefined;
  if (m !== null) {
    c = firstPoint.y - m * firstPoint.x;
  }

  return { isCollinear: true, m: m ?? Infinity, c };
}

// Ejemplo de uso
const points: Point[] = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 6 },
];

const result = checkCollinearityAndLineParams(points);
console.log(result);
// Output esperado: { isCollinear: true, m: 2, c: 0 }

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

export function getAwesomeSpiro(
  laps: number,
  petals: number,
  pointDistancePercentage: number,
): PathChunk[] {
  console.log({laps, petals, pointDistancePercentage})
  // const laps = getLaps(HYPOTROCHOID_FIXED_RADIUS, movingRadius)
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
  console.log({
    HYPOTROCHOID_FIXED_RADIUS,
    movingRadius,
    pointDistance,
    maxRadius,
    minRadius,
  })
  console.log({points, sizes, step: step / Math.PI * 180})
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