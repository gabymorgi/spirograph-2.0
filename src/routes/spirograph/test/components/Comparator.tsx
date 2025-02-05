import LineChart from '@/routes/spirograph/test/components/LineChart'
import { polinomicFunction } from '@/routes/spirograph/test/polinomic'
import { bCoef, mCoef } from '@/utils/data.json'
import { getHypotrochoidPoint } from '@/utils/functions'
import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from '@/utils/constants'
import { Point } from '@/utils/types'

function Comparator() {
  function getSizes(r: number, d: number): [number, number] {
    const step = (r * Math.PI) / HYPOTROCHOID_FIXED_RADIUS
    const samplingStep = step / 2
    const pointDistance = r * d

    const points: Point[] = []
    for (let i = 0; i <= 2; i++) {
      points.push(
        getHypotrochoidPoint(
          HYPOTROCHOID_FIXED_RADIUS,
          r,
          pointDistance,
          samplingStep * i,
        ),
      )
    }
    const theta = step - HALF_PI
    const Zx = (4 / 3) * (2 * points[1].x - points[0].x - points[2].x)
    const Zy = (4 / 3) * (2 * points[1].y - points[0].y - points[2].y)
    return [Zy - Zx * Math.tan(theta), Zx / Math.cos(theta)]
  }

  // const sizes = [
  //   innerData.b + innerData.m * distance * 100,
  //   innerData.b - innerData.m * distance * 100
  // ]

  const distance = 0.5

  const sizes = Array.from({ length: 120 }, (_, i) => i + 1).map((r) =>
    getSizes(r, distance),
  )
  const sizes0 = sizes.map((s, i) => ({ x: i + 1, y: s[0] }))
  const sizes1 = sizes.map((s, i) => ({ x: i + 1, y: s[1] }))

  const evaluated0Points = Array.from({ length: 120 }, (_, i) => i + 1).map(
    (r) => {
      const innerDataB =
        r < 60 ? polinomicFunction(bCoef, r) : polinomicFunction(mCoef, 120 - r)
      const innerDataM =
        r < 60 ? polinomicFunction(mCoef, r) : polinomicFunction(bCoef, 120 - r)
      return {
        x: r,
        y: innerDataB - innerDataM * distance,
      }
    },
  )

  const evaluated1Points = Array.from({ length: 120 }, (_, i) => i + 1).map(
    (r) => {
      const innerDataB =
        r < 60 ? polinomicFunction(bCoef, r) : polinomicFunction(mCoef, 120 - r)
      const innerDataM =
        r < 60 ? polinomicFunction(mCoef, r) : polinomicFunction(bCoef, 120 - r)
      return {
        x: r,
        y: innerDataB + innerDataM * distance,
      }
    },
  )

  console.log({ bCoef, mCoef })

  const error0 = evaluated0Points.map(({ x, y }) => {
    const real = getSizes(x, distance)[0]
    const diff = Math.abs(y - real)
    return {
      x: x,
      y: diff / real,
    }
  })

  const error1 = evaluated1Points.map(({ x, y }) => {
    const real = getSizes(x, distance)[1]
    const diff = Math.abs(y - real)
    return {
      x: x,
      y: diff / real,
    }
  })

  return (
    <div style={{ position: 'relative' }}>
      <LineChart
        datasets={[
          {
            name: 's0',
            points: sizes0,
          },
          {
            name: 's1',
            points: sizes1,
          },
          {
            name: 'eval s0',
            points: evaluated0Points,
          },
          {
            name: 'eval s1',
            points: evaluated1Points,
          },
        ]}
      />
      <LineChart
        datasets={[
          {
            name: 'Error 0',
            points: error0,
          },
          {
            name: 'Error 1',
            points: error1,
          },
        ]}
      />
    </div>
  )
}

export default Comparator
