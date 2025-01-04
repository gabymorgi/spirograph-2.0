import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import {
  getAwesomeSpiro,
  recalculateViewBox,
} from '@/utils/functions'
import {
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
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const pathChunks = useMemo(() => {
    const awesomeSpiro = getAwesomeSpiro(props.laps, props.petals, props.pointDistancePercentage)
    return awesomeSpiro
  }, [props.laps, props.petals, props.pointDistancePercentage])

  const startAnimation = useCallback(() => {
    const msPerStep = props.msPerPetal || 0
    if (animationIndex.current >= pathChunks.length) {
      return
    }
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }
    if (msPerStep < 1) {
      pathRef.current?.setAttribute('d', pathChunksToString(pathChunks))
      animationIndex.current = pathChunks.length
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
  }, [props.msPerPetal, pathChunks])

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

    toPng(svgRef.current as any, { cacheBust: true })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.laps,
    props.petals,
    props.pointDistancePercentage,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.msPerPetal])

  //viewbox effect
  useEffect(() => {
    if (svgRef.current === null) {
      return
    }
    const viewBox = recalculateViewBox({
      laps: props.laps,
      petals: props.petals,
      pointDistancePercentage: props.pointDistancePercentage,
      strokeWidthPercentage: props.strokeWidthPercentage,
    })
    svgRef.current.setAttribute('viewBox', viewBox)
    // set stroke width
    svgRef.current.setAttribute(
      'stroke-width',
      `${props.strokeWidthPercentage}%`,
    )
  }, [
    props.laps,
    props.petals,
    props.pointDistancePercentage,
    props.strokeWidthPercentage,
  ])

  return (
    <svg
      ref={svgRef}
      viewBox={`${-CANVAS_MAX_VALUE} ${-CANVAS_MAX_VALUE} ${CANVAS_SIZE} ${CANVAS_SIZE}`}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ backgroundColor: props.backgroundColor, maxHeight: '70vh' }}
    >
      <path ref={pathRef} stroke={props.color} />
    </svg>
  )
}

// const MemoizedSpiroCanvas = memo(SpiroCanvas)
const ForwardSpiroCanvas = forwardRef(SpiroCanvas)

export default ForwardSpiroCanvas
