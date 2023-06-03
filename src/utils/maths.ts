import { Line, LineSegment, Point } from './types'

export function getSlope(p1: Point, p2: Point): number {
  return (p2.y - p1.y) / (p2.x - p1.x)
}

export function getLineSegmentIntersection(
  line1: LineSegment,
  line2: LineSegment,
): Point {
  const slope1 = getSlope(line1.p1, line1.p2)
  const slope2 = getSlope(line2.p1, line2.p2)

  const x =
    (slope1 * line1.p1.x - slope2 * line2.p1.x - line1.p1.y + line2.p1.y) /
    (slope1 - slope2)
  const y = slope1 * (x - line1.p1.x) + line1.p1.y

  return { x, y }
}

export function getLineIntersection(line1: Line, line2: Line): Point {
  if (line1.slope === line2.slope) {
    throw new Error('Lines are parallel')
  }

  let x, y

  if (line1.slope === Infinity || line1.slope === -Infinity) {
    x = line1.point.x
    y = line2.slope * (x - line2.point.x) + line2.point.y
  } else if (line2.slope === Infinity || line2.slope === -Infinity) {
    x = line2.point.x
    y = line1.slope * (x - line1.point.x) + line1.point.y
  } else {
    x =
      (line2.slope * line2.point.x -
        line1.slope * line1.point.x -
        line2.point.y +
        line1.point.y) /
      (line2.slope - line1.slope)
    y = line2.slope * (x - line2.point.x) + line2.point.y
  }

  return { x, y }
}

export function derivativeOnPoint(prevPoint: Point, nextPoint: Point): number {
  return (nextPoint.y - prevPoint.y) / (nextPoint.x - prevPoint.x)
}

export function getStepSize(
  getPoint: (t: number) => Point,
  threshold: [number, number],
): number {
  const tStart = 0
  const tEnd = Math.PI * 0.5
  let stepNumber = 127
  let step = (tEnd - tStart) / stepNumber
  let t = tStart
  const points = []
  // Calcula los puntos iniciales
  for (let i = 0; i < 3; i++) {
    points.push(getPoint(t))
    t += step
  }

  const steps = []

  do {
    points.push(getPoint(t))
    // Calcula la magnitud del cambio en la función
    const slope1 = derivativeOnPoint(points[0], points[2])
    const slope2 = derivativeOnPoint(points[1], points[3])
    const change = Math.abs(slope2 - slope1)
    if (change > threshold[1]) {
      step /= 1 + (change - threshold[1]) / threshold[1]
      steps.push(step)
    } else if (change < threshold[0]) {
      step *= 1 + (threshold[0] - change) / threshold[0]
      steps.push(step)
    }
    points.shift()
    stepNumber--
    t += step
  } while (stepNumber > 0)

  const prom = steps.reduce((acc, val) => acc + val, 0) / steps.length
  return (2 * Math.PI) / Math.round((2 * Math.PI) / prom)
}

// Función para calcular el MCD usando el algoritmo de Euclides
function gcd(fixedRadius: number, movingRadius: number): number {
  if (movingRadius === 0) {
    return fixedRadius
  } else {
    return gcd(movingRadius, fixedRadius % movingRadius)
  }
}

export function getLaps(fixedRadius: number, movingRadius: number): number {
  // Calcular el MCD de 'fixedRadius' y 'movingRadius'
  const divisor = gcd(fixedRadius, movingRadius)

  // Dividir 'movingRadius' por el MCD para obtener el número de vueltas
  const laps = movingRadius / divisor

  return laps
}

export function getPetalsAmount(
  fixedRadius: number,
  movingRadius: number,
): number {
  const divisor = gcd(fixedRadius, movingRadius)
  const petals = fixedRadius / divisor
  return petals
}

export function getMovingRadius(
  fixedRadius: number,
  petals: number,
  laps: number,
): number {
  const divisor = fixedRadius / petals
  return divisor * laps
}

export function getViewBox(points: Point[]): string {
  const minX = Math.min(...points.map((point) => point.x))
  const maxX = Math.max(...points.map((point) => point.x))
  const minY = Math.min(...points.map((point) => point.y))
  const maxY = Math.max(...points.map((point) => point.y))
  const width = maxX - minX
  const height = maxY - minY
  const viewBox = `${minX - width * 0.1} ${minY - height * 0.1} ${
    width * 1.2
  } ${height * 1.2}`
  return viewBox
}
