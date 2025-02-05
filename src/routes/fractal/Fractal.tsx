import { useMemo } from 'react'

const MAX_CIRCLES = 100
const BASE = 0.618
const BASE_R = 40
const N = 5

interface Circle {
  x: number
  y: number
  r: number
  a: [number, number]
}

function printCircles(circles: Circle[]) {
  const result = circles.map((circle) => {
    return `x: ${circle.x.toFixed(2)}, y: ${circle.y.toFixed(
      2,
    )}, r: ${circle.r.toFixed(2)}, a: [${(
      (circle.a[0] / Math.PI) *
      180
    ).toFixed(2)}, ${((circle.a[1] / Math.PI) * 180).toFixed(2)}]`
  })
  console.log(result)
}

function calc(): Circle[] {
  const fullCircle = 2 * Math.PI
  const alpha = fullCircle / N
  // const halfAlpha = alpha * 0.5
  const totalCircles: Circle[] = [{ x: 0, y: 0, r: BASE_R, a: [0, fullCircle] }]
  let levelCircles: Circle[] = []
  let radius = totalCircles[0].r * (BASE + 1)
  for (let i = 0, angleStep = 0; i < N; i++, angleStep += alpha) {
    const circle = totalCircles[0]
    const x = circle.x + radius * Math.cos(angleStep)
    const y = circle.y + radius * Math.sin(angleStep)
    levelCircles.push({
      x,
      y,
      r: totalCircles[0].r * BASE,
      a: [angleStep - Math.PI + alpha, angleStep + Math.PI - alpha],
    })
  }
  do {
    const newLevelCircles: Circle[] = []
    radius = levelCircles[0].r * (BASE + 1)
    for (let c = 0; c < levelCircles.length; c++) {
      for (
        let i = 0, angleStep = levelCircles[c].a[0];
        i < N - 1;
        i++, angleStep += alpha
      ) {
        const circle = levelCircles[c]
        const x = circle.x + radius * Math.cos(angleStep)
        const y = circle.y + radius * Math.sin(angleStep)
        newLevelCircles.push({
          x,
          y,
          r: levelCircles[c].r * BASE,
          a: [angleStep - Math.PI + alpha, angleStep + Math.PI - alpha],
        })
      }
    }
    totalCircles.push(...levelCircles)
    levelCircles = newLevelCircles
  } while (totalCircles.length < MAX_CIRCLES)
  printCircles(totalCircles)
  return totalCircles
  // while (totalCircles.length < MAX_CIRCLES) {
  //   console.log({ levelCircles, totalCircles })
  //   for (const circle of levelCircles) {
  //     totalCircles.push(circle)
  //   }
  // }
}

function Fractal() {
  const circles = useMemo(() => {
    try {
      const res = calc()
      return res
    } catch (error) {
      console.error(error)
    }
    return []
  }, [])
  return (
    <div className="flex flex-col gap-16 p-16">
      <svg
        // ref={svgRef}
        viewBox="-200 -200 400 400"
        width="100%"
        height="100%"
      >
        {circles.map((circle, index) => (
          <circle
            key={index}
            cx={circle.x}
            cy={circle.y}
            r={circle.r}
            fill="none"
            stroke="white"
          />
        ))}
      </svg>
    </div>
  )
}

export default Fractal
