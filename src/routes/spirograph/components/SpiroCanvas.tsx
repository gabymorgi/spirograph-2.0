import {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react'
import { SpiroAnimationSettings, SpiroParams, SpiroSettings } from '@/utils/types'
import { toPng } from 'html-to-image'
import { message } from 'antd'
import { getKeyPoints, getPath, getSpiroParams, getSpiroTransition, getTransitionDuration } from '@/utils/functions'
import { pathChunksToString } from '@/utils/canvasUtils'

export interface SpiroCanvasHandle {
  redraw: (vel: number) => void
  download: () => void
}

type SpiroCanvasProps = Partial<SpiroAnimationSettings> & SpiroSettings

const SpiroCanvas: React.ForwardRefRenderFunction<
  SpiroCanvasHandle,
  SpiroCanvasProps
> = (props, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const animationId = useRef<number | null>(null)
  const prevSpiro = useRef<SpiroParams | null>(null)
  const postSpiro = useRef<SpiroParams | null>(null)

  useEffect(() => {
    postSpiro.current = getSpiroParams(props.petals, props.laps, props.distance)
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }
    if (!prevSpiro.current) {
      pathRef.current?.setAttribute('d', pathChunksToString(getPath(getKeyPoints(postSpiro.current))))
    } else {
      const duration = getTransitionDuration(prevSpiro.current as Required<SpiroParams>, postSpiro.current as Required<SpiroParams>)
      let start: number = 0
      function step(timestamp: number) {
        if (!prevSpiro.current || !postSpiro.current) return;
        if (!start) start = timestamp
        const progress = (timestamp - start) / duration
        if (progress < 1) {
          const path = getSpiroTransition(prevSpiro.current, postSpiro.current, progress)
          pathRef.current?.setAttribute('d', pathChunksToString(path))
          animationId.current = requestAnimationFrame(step)
        } else {
          pathRef.current?.setAttribute('d', pathChunksToString(getPath(getKeyPoints(postSpiro.current))))
        }
      }
  
      animationId.current = requestAnimationFrame(step)
    }
    
    return () => {
      prevSpiro.current = postSpiro.current
    }
  }, [props.petals, props.laps, props.distance])

  const handleRedraw = useCallback((msPerPetal: number) => {
    if (msPerPetal === 0) {
      return
    }
    const path = pathRef.current
    if (!path) {
      return
    }
    const length = path.getTotalLength().toString();
    const vel = (msPerPetal || 0) * props.petals / 1000

    // Borrar la animación anterior
    // path.style.transition = 'none';
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Esperar a que se aplique el estilo
    requestAnimationFrame(() => {
      path.style.transition = `all ${vel}s linear`;
      path.style.strokeDashoffset = '0';
      path.addEventListener(
        "transitionend",
        () => {
          // Resetear la animación
          path.style.strokeDashoffset = 'unset';
          path.style.strokeDasharray = 'unset';
          path.style.transition = 'none';
        },
        { once: true }
      );
    });
  }, [props.petals])

  useImperativeHandle(ref, () => ({
    redraw: handleRedraw,
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

  return (
    <svg
      ref={svgRef}
      viewBox="-1.1 -1.1 2.2 2.2"
      strokeWidth={`${props.strokeWidth}%`}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxHeight: '70vh' }}
    >
      <path ref={pathRef} stroke={props.color} />
    </svg>
  )
}

// const MemoizedSpiroCanvas = memo(SpiroCanvas)
const ForwardSpiroCanvas = forwardRef(SpiroCanvas)

export default ForwardSpiroCanvas
