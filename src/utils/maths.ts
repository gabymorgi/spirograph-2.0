import { Point } from './types'

export function nonCommonDivisors(number: number): number[] {
  const result: number[] = []

  for (let i = 1; i < number; i++) {
    if (gcd(number, i) === 1) {
      result.push(i)
    }
  }

  return result
}

export function selectEvenlySpacedValues<T>(
  numbers: T[],
  amount: number,
): T[] {
  if (numbers.length <= amount) {
    return numbers
  }

  const result: T[] = []
  const interval = (numbers.length - 1) / (amount - 1)

  // select evenly spaced values
  for (let i = 0; i < amount; i++) {
    result.push(numbers[Math.round(interval * i)])
  }

  return result
}

export function getSlope(p1: Point, p2: Point): number {
  return (p2.y - p1.y) / (p2.x - p1.x)
}

// Función para calcular el MCD usando el algoritmo de Euclides
function gcd(a: number, b: number, recursion: number = 1): number {
  if (recursion > 100) {
    console.warn('Recursion limit reached', a, b)
    return a
  }
  if (b === 0) {
    return a
  } else {
    return gcd(b, a % b, recursion + 1)
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
