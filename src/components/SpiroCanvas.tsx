import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { calculateSpirographPoints } from '@/utils/functions'
import {
  getPath,
  pathChunkToString,
  pathChunksToString,
} from '@/utils/canvasUtils'
import { SpiroAnimationSettings, SpiroSettings } from '@/utils/types'
import { toPng } from 'html-to-image'
import { message } from 'antd'
import { CANVAS_MAX_VALUE, CANVAS_SIZE } from '@/utils/constants'

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
    const pointsPerPetal = points.length / props.petals
    return props.msPerPetal ? props.msPerPetal / pointsPerPetal : 0
  }, [props.petals, points.length, props.msPerPetal])

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

  // animation effect
  useEffect(() => {
    restartAnimation()

    return () => {
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
  ])

  useEffect(() => {
    if (animationIndex.current < pathChunks.length) {
      startAnimation()
    }
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [props.msPerPetal])

  return (
    <svg
      ref={svgRef as never}
      viewBox={`${-CANVAS_MAX_VALUE} ${-CANVAS_MAX_VALUE} ${CANVAS_SIZE} ${CANVAS_SIZE}`}
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
