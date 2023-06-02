import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import {
  calculateSpirographPoints,
  recalculateViewBox,
} from '@/utils/functions'
import {
  getPath,
  pathChunkToString,
  pathChunksToString,
} from '@/utils/canvasUtils'
import { SpiroAnimationSettings, SpiroSettings } from '@/utils/types'
import { toPng } from 'html-to-image'

export interface SpiroCanvasHandle {
  redraw: () => void
  download: () => void
}

type SpiroCanvasProps = Partial<SpiroAnimationSettings> & SpiroSettings

const SpiroCanvas: React.ForwardRefRenderFunction<
  SpiroCanvasHandle,
  SpiroCanvasProps
> = (props, ref) => {
  const animationId = useRef<number | null>(null)
  const animationFinished = useRef<boolean>(false)
  const animationIndex = useRef<number>(0)
  const svgRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const prevPointsLength = useRef<number>(0)

  const { points, laps } = useMemo(() => {
    return calculateSpirographPoints(
      props.movingRadius,
      props.pointDistance,
      props.stepPerLap,
    )
  }, [props.movingRadius, props.pointDistance, props.stepPerLap])

  const pathChunks = useMemo(() => {
    return getPath(points, props.interpolation)
  }, [points, props.interpolation])

  const msPerStep = useMemo(() => {
    const msPerLap = props.msPerLap || 0
    return msPerLap ? (msPerLap * laps) / points.length : 0
  }, [laps, points.length, props.msPerLap])

  useEffect(() => {
    const viewBox = recalculateViewBox({
      movingRadius: props.movingRadius,
      pointDistance: props.pointDistance,
      strokeWidth: props.strokeWidth,
    })
    svgRef.current?.setAttribute('viewBox', viewBox)
  }, [props.movingRadius, props.pointDistance, props.strokeWidth])

  const startAnimation = useCallback(() => {
    if (animationFinished.current) {
      return
    }
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }
    if (msPerStep < 1) {
      pathRef.current?.setAttribute('d', pathChunksToString(pathChunks))
      return
    }

    let start: number | null = null

    function step(timestamp: number) {
      if (!start) start = timestamp

      if (timestamp - start > msPerStep) {
        let path = pathRef.current?.getAttribute('d') || ''
        while (timestamp - start > msPerStep) {
          start += msPerStep

          if (animationIndex.current < pathChunks.length) {
            path += pathChunkToString(pathChunks[animationIndex.current])

            animationIndex.current += 1
          } else {
            animationFinished.current = true
            break
          }
        }
        pathRef.current?.setAttribute('d', path)
      }

      if (animationIndex.current < pathChunks.length) {
        animationId.current = requestAnimationFrame(step)
      }
    }

    animationId.current = requestAnimationFrame(step)
  }, [msPerStep, pathChunks])

  const restartAnimation = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }
    animationFinished.current = false
    animationIndex.current = 0
    pathRef.current?.setAttribute('d', '')
    startAnimation()
  }, [startAnimation])

  useImperativeHandle(ref, () => ({
    redraw: restartAnimation,
    download: handleDownload,
  }))

  const handleDownload = useCallback(() => {
    if (svgRef.current === null) {
      return
    }

    toPng(svgRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${props.name}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [props.name])

  // if shape settings change, restart animation
  useEffect(() => {
    console.log('useEffect', animationFinished.current)
    restartAnimation()
  }, [props.movingRadius, props.pointDistance])

  // if sampling change, update path with the same percentage of the animation
  // then continue the animation
  useEffect(() => {
    console.log(points, prevPointsLength.current, animationFinished.current)
    const percentage = animationIndex.current / prevPointsLength.current
    animationIndex.current = Math.floor(points.length * percentage)
    pathRef.current?.setAttribute(
      'd',
      pathChunksToString(pathChunks.slice(0, animationIndex.current)),
    )
    if (!animationFinished.current) {
      startAnimation()
    }

    return () => {
      prevPointsLength.current = points.length
    }
  }, [props.stepPerLap])

  // if interpolation change, update path until the current animation index
  useEffect(() => {
    if (animationFinished.current) {
      return
    }
    pathRef.current?.setAttribute(
      'd',
      pathChunksToString(pathChunks.slice(0, animationIndex.current)),
    )
  }, [props.interpolation])

  // if speed change, continue the animation
  useEffect(() => {
    if (animationFinished.current) {
      return
    }
    startAnimation()
  }, [props.msPerLap])

  return (
    <svg
      ref={svgRef as never}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={props.strokeWidth}
      style={{ backgroundColor: props.backgroundColor }}
    >
      <path ref={pathRef} stroke={props.color} />
    </svg>
  )
}

// const MemoizedSpiroCanvas = memo(SpiroCanvas)
const ForwardSpiroCanvas = forwardRef(SpiroCanvas)

export default ForwardSpiroCanvas
