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
import { message } from 'antd'

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
  const animationIndex = useRef<number>(0)
  const svgRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const prevPointsLength = useRef<number>(0)
  const prevProps = useRef<SpiroCanvasProps>()

  const points = useMemo(() => {
    return calculateSpirographPoints(
      props.laps,
      props.petals,
      props.pointDistance,
      props.stepPerLap,
    )
  }, [props.laps, props.pointDistance, props.petals, props.stepPerLap])

  const pathChunks = useMemo(() => {
    return getPath(points, props.interpolation)
  }, [points, props.interpolation])

  const msPerStep = useMemo(() => {
    const msPerLap = props.msPerLap || 0
    return msPerLap ? (msPerLap * props.laps) / points.length : 0
  }, [props.laps, points.length, props.msPerLap])

  const startAnimation = useCallback(() => {
    if (animationIndex.current >= pathChunks.length) {
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
        message.error(err.message)
      })
  }, [props.name])

  // viewbox effect
  useEffect(() => {
    const viewBox = recalculateViewBox({
      laps: props.laps,
      petals: props.petals,
      pointDistance: props.pointDistance,
      strokeWidth: props.strokeWidth,
    })
    svgRef.current?.setAttribute('viewBox', viewBox)
  }, [props.laps, props.petals, props.pointDistance, props.strokeWidth])

  // animation effect
  // this effect has multiple purposes
  // but I don't split it into multiple effects because it uses a lot of the same variables
  // and I don't want to struggle with race conditions
  useEffect(() => {
    // if shape settings change, restart animation
    if (
      prevProps.current?.laps !== props.laps ||
      prevProps.current?.petals !== props.petals ||
      prevProps.current?.pointDistance !== props.pointDistance
    ) {
      restartAnimation()
    } else {
      // if sampling change, update path with the same percentage of the animation
      // then continue the animation
      if (prevProps.current?.stepPerLap !== props.stepPerLap) {
        if (prevPointsLength.current === 0) {
          return
        }
        const percentage = animationIndex.current / prevPointsLength.current
        animationIndex.current = Math.floor(points.length * percentage)
        pathRef.current?.setAttribute(
          'd',
          pathChunksToString(pathChunks.slice(0, animationIndex.current)),
        )
      }

      // if interpolation change, update path until the current animation index
      if (prevProps.current?.interpolation !== props.interpolation) {
        pathRef.current?.setAttribute(
          'd',
          pathChunksToString(pathChunks.slice(0, animationIndex.current)),
        )
      }

      // continue the animation
      if (animationIndex.current < pathChunks.length) {
        startAnimation()
      }
    }

    return () => {
      prevProps.current = props
      prevPointsLength.current = points.length
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [
    props.laps,
    props.petals,
    props.pointDistance,
    props.stepPerLap,
    props.interpolation,
    props.msPerLap,
  ])

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
