import { polinomicFunction } from "@/routes/spirograph/test/polinomic"
import { pathChunksToString } from "@/utils/canvasUtils"
import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from "@/utils/constants"
import { getMovingRadius } from "@/utils/maths"
import { PathChunk, Point } from "@/utils/types"
import { useMemo } from "react"
import { bCoef, mCoef } from '@/utils/data.json'

function useSpiro(petals: number, laps: number, distance: number) {
  function normalizePath(awesomeSpiro: PathChunk[]): PathChunk[] {
    const divisor = awesomeSpiro[0].points[0].x
    return awesomeSpiro.map((v) => ({ 
      points: v.points.map((p) => ({ x: p.x / divisor, y: p.y / divisor })),
      command: v.command
    }))
  }

  const path: string = useMemo(() => {
    if (!petals || !laps || !distance) {
      console.warn('Invalid parameters', petals, laps, distance)
      return ''
    }
    const radius = getMovingRadius(HYPOTROCHOID_FIXED_RADIUS, petals, laps)
    const innerDataB = radius < 60 ? polinomicFunction(bCoef, radius) : polinomicFunction(mCoef, 120 - radius)
    const innerDataM = radius < 60 ? polinomicFunction(mCoef, radius) : polinomicFunction(bCoef, 120 - radius)
    const sizes = [
      innerDataB - innerDataM * distance,
      innerDataB + innerDataM * distance
    ]

    const pointDistance = radius * distance
    let isInverted = pointDistance > HYPOTROCHOID_FIXED_RADIUS - radius
    const invertedSizes = [sizes[1], sizes[0]]

    const maxRadius = HYPOTROCHOID_FIXED_RADIUS - radius + pointDistance
    let minRadius = HYPOTROCHOID_FIXED_RADIUS - radius - pointDistance

    let step = (laps * Math.PI) / petals
    if (isInverted) {
      step -= Math.PI
      minRadius = -minRadius
    }
    let prevPoint: Point = { x: maxRadius, y: 0 }
    let prevStep = 0
    const commands: PathChunk[] = [{ command: 'M', points: [prevPoint] }]
    let isEven = true
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
    return pathChunksToString(normalizePath(commands))
  }, [petals, laps, distance])

  return path
}

export default useSpiro
