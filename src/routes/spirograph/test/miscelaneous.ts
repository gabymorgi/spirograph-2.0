export function findMaximum(
  fn: (x: number) => number,
  left: number,
  right: number,
  tolerance: number = 0
): number {
  let recursionLimit = 1000;
  while (right - left > tolerance) {
    const mid1 = left + (right - left) / 3;
    const mid2 = right - (right - left) / 3;

    const f1 = fn(mid1);
    const f2 = fn(mid2);

    if (f1 < f2) {
      left = mid1; // El máximo está a la derecha
    } else {
      right = mid2; // El máximo está a la izquierda
    }
    if (recursionLimit-- <= 0) {
      console.warn("Límite de recursión alcanzado.");
      break;
    }
  }

  // Devuelve el punto medio del intervalo como la mejor aproximación
  return (left + right) / 2;
}