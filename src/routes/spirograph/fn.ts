

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}


export function radialLerp(
  a: number,
  b: number,
  t: number,
  clockwise: boolean,
) {
  if (clockwise) {
    if (a > b) {
      b += 2 * Math.PI
    }
  } else {
    if (a < b) {
      a += 2 * Math.PI
    }
  }
  return lerp(a, b, t)
}