import { pathChunksToString } from "@/utils/canvasUtils"
import { HALF_PI, HYPOTROCHOID_FIXED_RADIUS } from "@/utils/constants"
import { getHypotrochoidPoint } from "@/utils/functions"
import { getMovingRadius } from "@/utils/maths"
import { PathChunk, Point } from "@/utils/types"
import { useMemo, useRef } from "react"

function useSpiro(petals: number, laps: number, distance: number) {
  const spiroInnerData = useRef({
    p: 0,
    l: 0,
    r: 0,
    b: 0,
    m: 0,
  })

  function normalizePath(awesomeSpiro: PathChunk[]): PathChunk[] {
    const divisor = awesomeSpiro[0].points[0].x
    return awesomeSpiro.map((v) => ({ 
      points: v.points.map((p) => ({ x: p.x / divisor, y: p.y / divisor })),
      command: v.command
    }))
  }

  function getSizes(d: number): [number, number] {
    const innerData = spiroInnerData.current
    let step = (innerData.l * Math.PI) / innerData.p
    const samplingStep = step / 2
    const pointDistance = innerData.r * d
    
    const points: Point[] = []
    for (let i = 0; i <= 2; i++) {
      points.push(getHypotrochoidPoint(
        HYPOTROCHOID_FIXED_RADIUS,
        innerData.r,
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

  type Line = { m: number; b: number };
  function getLineParams(points: [Point, Point]): Line {
    const deltaX = points[1].x - points[0].x;
    const deltaY = points[1].y - points[0].y;
    let m: number = deltaX === 0 ? Infinity : deltaY / deltaX;

    let b = points[0].y - m * points[0].x

    return { m, b };
  }

  const path: string = useMemo(() => {
    if (!petals || !laps || !distance) {
      console.warn('Invalid parameters', petals, laps, distance)
      return ''
    }
    const innerData = spiroInnerData.current
    if (petals !== innerData.p || laps !== innerData.l) {
      innerData.p = petals
      innerData.l = laps
      innerData.r = getMovingRadius(HYPOTROCHOID_FIXED_RADIUS, petals, laps)
      const size0 = getSizes(0)
      const size100 = getSizes(1)
      const lineParams = getLineParams(
        [{ x: 0, y: size0[0] },
        { x: 100, y: size100[0] }]
      )

      innerData.b = lineParams.b
      innerData.m = lineParams.m
    }
    
    const sizes = [
      innerData.b + innerData.m * distance * 100,
      innerData.b - innerData.m * distance * 100
    ]

    const pointDistance = innerData.r * distance
    let isInverted = pointDistance > HYPOTROCHOID_FIXED_RADIUS - innerData.r
    const invertedSizes = [sizes[1], sizes[0]]

    const maxRadius = HYPOTROCHOID_FIXED_RADIUS - innerData.r + pointDistance
    let minRadius = HYPOTROCHOID_FIXED_RADIUS - innerData.r - pointDistance

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
