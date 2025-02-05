import { Point } from 'chart.js'
import { gaussianElimination } from './gauss'

export function findPolinomicCoefficients(points: Point[]) {
  const matrix = points.map((p) =>
    Array.from({ length: points.length }, (_, i) => Math.pow(p.x, i)),
  )
  const vector = points.map((p) => p.y)
  return gaussianElimination(matrix, vector)
}

export function polinomicFunction(coefficients: number[], x: number): number {
  return coefficients.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0)
}

export function findRationalCoefficients(points: Point[], degreeQ: number = 0) {
  const degreeP = points.length - degreeQ - 2
  if (degreeP < 0) {
    throw new Error(
      'Se necesitan al menos ' +
        degreeQ +
        2 +
        ' puntos para ajustar el polinomio racional',
    )
  }
  const matrix: number[][] = []
  const vector: number[] = []

  for (const { x, y } of points) {
    const row: number[] = []

    // Coeficientes de p(x)
    for (let i = 0; i <= degreeP; i++) {
      row.push(Math.pow(x, i))
    }

    // Coeficientes de q(x)
    for (let i = 0; i <= degreeQ; i++) {
      row.push(-y * Math.pow(x, i))
    }

    matrix.push(row)
    vector.push(y)
  }

  // Resuelve el sistema lineal
  return gaussianElimination(matrix, vector)
}

export function rationalFunction(
  coefficients: number[],
  degreeQ: number,
  x: number,
): number {
  const degreeP = coefficients.length - degreeQ - 1
  const p = coefficients
    .slice(0, degreeP + 1)
    .reduce((sum, c, i) => sum + c * Math.pow(x, i), 0)
  const q = coefficients
    .slice(degreeP + 1)
    .reduce((sum, c, i) => sum + c * Math.pow(x, i + 1), 1)
  return p / q
}
