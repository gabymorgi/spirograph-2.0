import { Point } from 'chart.js'

/**
 * Calcula los valores de t basados en la longitud acumulada de los puntos.
 * @param points Arreglo de puntos ({x, y})
 * @returns Arreglo de valores t normalizados [0, 1]
 */
function calculateNormalizedT(points: Point[]): number[] {
  if (points.length < 2) {
    throw new Error('Se necesitan al menos dos puntos para calcular t.')
  }

  const distances: number[] = []
  let totalDistance = 0

  // Calcular distancias acumuladas
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    const distance = Math.hypot(dx, dy)
    distances.push(distance)
    totalDistance += distance
  }

  // Calcular t normalizado
  const normalizedT: number[] = [0] // t empieza en 0 para el primer punto
  let accumulatedDistance = 0

  for (let i = 0; i < distances.length; i++) {
    accumulatedDistance += distances[i]
    normalizedT.push(accumulatedDistance / totalDistance)
  }

  return normalizedT
}

/**
 * Ajusta una curva de Bézier cuadrática a los puntos dados.
 * @param points Arreglo de puntos ({x, y})
 * @returns Punto de control P1 de la curva Bézier
 */
export function fitQuadraticBezier(points: Point[]): [Point, Point, Point] {
  if (points.length < 3) {
    throw new Error(
      'Se necesitan al menos tres puntos para ajustar una curva de Bézier cuadrática.',
    )
  }

  function getCP(P0: number, Bt: number, P2: number, t: number): number {
    const oneMinusT = 1 - t
    return (Bt - oneMinusT * oneMinusT * P0 - t * t * P2) / (2 * t * oneMinusT)
  }

  const tValues = calculateNormalizedT(points)
  console.log({ tValues })

  // Puntos extremos
  const P0 = points[0]
  const P2 = points[points.length - 1]

  const estimatedP1: Point = { x: 0, y: 0 }
  let estimatedError = Infinity

  const logErrors = []
  // Ajustar el punto de control P1
  for (let i = 1; i < points.length - 1; i++) {
    const x1 = getCP(P0.x, points[i].x, P2.x, tValues[i])
    const y1 = getCP(P0.y, points[i].y, P2.y, tValues[i])

    const meanSquareError =
      points.reduce((sum, point, j) => {
        const t = tValues[j]
        const oneMinusT = 1 - t
        const x =
          oneMinusT * oneMinusT * P0.x + 2 * oneMinusT * t * x1 + t * t * P2.x
        const y =
          oneMinusT * oneMinusT * P0.y + 2 * oneMinusT * t * y1 + t * t * P2.y
        return sum + Math.hypot(point.x - x, point.y - y)
      }, 0) / points.length

    logErrors.push({ i, error: meanSquareError })

    if (meanSquareError < estimatedError) {
      estimatedError = meanSquareError
      estimatedP1.x = x1
      estimatedP1.y = y1
    }
  }

  // console.log({ logErrors });

  return [P0, estimatedP1, P2]
}

/**
 * Ajusta una curva de Bézier cuadrática a los puntos dados.
 * @param points Arreglo de puntos ({x, y})
 * @returns Punto de control P1 de la curva Bézier
 */
export function fitCubicBezier(points: Point[]): [Point, Point, Point, Point] {
  if (points.length < 4) {
    throw new Error(
      'Se necesitan al menos cuatro puntos para ajustar una curva de Bézier cubica.',
    )
  }

  function getCP(
    P0: number,
    Bt1: number,
    Bt2: number,
    P3: number,
    t1: number,
    t2: number,
  ): [number, number] {
    const oneMinusT1 = 1 - t1
    const oneMinusT2 = 1 - t2
    const numeratorT1 =
      (Bt1 - Math.pow(oneMinusT1, 3) * P0 - Math.pow(t1, 3) * P3) /
      (3 * t1 * t1 * oneMinusT1)
    const numeratorT2 =
      (Bt2 - Math.pow(oneMinusT2, 3) * P0 - Math.pow(t2, 3) * P3) /
      (3 * t2 * t2 * oneMinusT2)
    const denominatorT1 = oneMinusT1 / t1
    const denominatorT2 = oneMinusT2 / t2
    const P1 = (numeratorT1 - numeratorT2) / (denominatorT1 - denominatorT2)
    const P2 = numeratorT1 - denominatorT1 * P1
    return [P1, P2]
  }

  const tValues = calculateNormalizedT(points)

  // Puntos extremos
  const P0 = points[0]
  const P3 = points[points.length - 1]

  let estimatedP1: Point = { x: 0, y: 0 }
  let estimatedP2: Point = { x: 0, y: 0 }
  let estimatedError = Infinity

  const logErrors = []

  // Ajustar los puntos de control P1 y P2
  for (let i = 1; i < points.length - 2; i++) {
    for (let j = i + 1; j < points.length - 1; j++) {
      const [x1, x2] = getCP(
        P0.x,
        points[i].x,
        points[j].x,
        P3.x,
        tValues[i],
        tValues[j],
      )
      const [y1, y2] = getCP(
        P0.y,
        points[i].y,
        points[j].y,
        P3.y,
        tValues[i],
        tValues[j],
      )

      const meanSquareError =
        points.reduce((sum, point, k) => {
          const t = tValues[k]
          const oneMinusT = 1 - t
          const x =
            Math.pow(oneMinusT, 3) * P0.x +
            3 * oneMinusT * oneMinusT * t * x1 +
            3 * oneMinusT * t * t * x2 +
            Math.pow(t, 3) * P3.x
          const y =
            Math.pow(oneMinusT, 3) * P0.y +
            3 * oneMinusT * oneMinusT * t * y1 +
            3 * oneMinusT * t * t * y2 +
            Math.pow(t, 3) * P3.y
          return sum + Math.hypot(point.x - x, point.y - y)
        }, 0) / points.length

      logErrors.push({ i, j, error: meanSquareError })

      if (meanSquareError < estimatedError) {
        estimatedError = meanSquareError
        estimatedP1 = { x: x1, y: y1 }
        estimatedP2 = { x: x2, y: y2 }
      }
    }
  }

  console.log({ estimatedError })

  return [P0, estimatedP1, estimatedP2, P3]
}

export function cubicBezier(points: number[], t: number): number {
  const oneMinusT = 1 - t
  return (
    Math.pow(oneMinusT, 3) * points[0] +
    3 * oneMinusT * oneMinusT * t * points[1] +
    3 * oneMinusT * t * t * points[2] +
    Math.pow(t, 3) * points[3]
  )
}
