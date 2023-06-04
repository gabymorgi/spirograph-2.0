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
import { SpiroAnimationSettings } from '@/utils/types'
import { toPng } from 'html-to-image'
import { message } from 'antd'
import { CANVAS_MAX_VALUE, CANVAS_SIZE } from '@/utils/constants'
import { SpiroParam } from '@/utils/queryParamsUtils'
import { useQueryParams } from 'use-query-params'

export interface SpiroCanvasHandle {
  redraw: () => void
  download: () => void
}

const SpiroCanvas: React.ForwardRefRenderFunction<
  SpiroCanvasHandle,
  unknown
> = (_props, ref) => {
  const [query] = useQueryParams(SpiroParam)
  const spiro = query as SpiroAnimationSettings
  const animationId = useRef<number | null>(null)
  const animationIndex = useRef<number>(0)
  const svgRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const points = useMemo(() => {
    return calculateSpirographPoints(
      spiro.laps,
      spiro.petals,
      spiro.pointDistancePercentage,
      spiro.stepPerLap,
    )
  }, [
    spiro.laps,
    spiro.pointDistancePercentage,
    spiro.petals,
    spiro.stepPerLap,
  ])

  const pathChunks = useMemo(() => {
    return getPath(points, spiro.interpolation)
  }, [points, spiro.interpolation])

  const msPerStep = useMemo(() => {
    const pointsPerPetal = points.length / spiro.petals
    return spiro.msPerPetal ? spiro.msPerPetal / pointsPerPetal : 0
  }, [spiro.petals, points.length, spiro.msPerPetal])

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
        link.download = `${spiro.name}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        message.error(err.message)
      })
  }, [spiro.name])

  // animation effect
  useEffect(() => {
    restartAnimation()

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [
    spiro.laps,
    spiro.petals,
    spiro.pointDistancePercentage,
    spiro.stepPerLap,
    spiro.interpolation,
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
  }, [spiro.msPerPetal])

  return (
    <svg
      ref={svgRef as never}
      viewBox={`${-CANVAS_MAX_VALUE} ${-CANVAS_MAX_VALUE} ${CANVAS_SIZE} ${CANVAS_SIZE}`}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={spiro.strokeWidth}
      style={{ backgroundColor: spiro.backgroundColor, maxHeight: '70vh' }}
    >
      <path ref={pathRef} stroke={spiro.color} />
    </svg>
  )
}

// const MemoizedSpiroCanvas = memo(SpiroCanvas)
const ForwardSpiroCanvas = forwardRef(SpiroCanvas)

export default ForwardSpiroCanvas
