import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { SpiroAnimationSettings, SpiroSettings } from '@/utils/types'
import { toPng } from 'html-to-image'
import { message } from 'antd'
import styled from 'styled-components'
import useSpiro from '@/hooks/useSpiro'

interface StyledSvgProps {
  vel: number
}

const StyledSvg = styled.svg<StyledSvgProps>`
  path {
    transition: all 2s linear;
  }
`

export interface SpiroCanvasHandle {
  redraw: () => void
  download: () => void
}

type SpiroCanvasProps = Partial<SpiroAnimationSettings> & SpiroSettings

const SpiroCanvas: React.ForwardRefRenderFunction<
  SpiroCanvasHandle,
  SpiroCanvasProps
> = (props, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const dPath = useSpiro(props.petals, props.laps, props.distance)

  const vel = useMemo(() => {
    return (props.msPerPetal || 0) * props.petals / 1000
  }, [props.msPerPetal, props.petals])

  const startAnimation = useCallback(() => {
    const path = pathRef.current
    if (!path) {
      return
    }
    const length = path.getTotalLength().toString();
    console.log(length)

    // Borrar la animación anterior
    path.style.transition = 'none';
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Esperar a que se aplique el estilo
    requestAnimationFrame(() => {
      path.style.transition = `stroke-dashoffset ${vel}s linear`;
      path.style.strokeDashoffset = '0';
      path.addEventListener(
        "transitionend",
        () => {
          // Resetear la animación
          path.style.strokeDashoffset = 'unset';
          path.style.strokeDasharray = 'unset';
          path.style.transition = 'all 2s linear, stroke-dashoffset 0s';
        },
        { once: true }
      );
    });
  }, [vel])

  useImperativeHandle(ref, () => ({
    redraw: startAnimation,
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
    startAnimation()
  }, [])

  return (
    <StyledSvg
      ref={svgRef}
      viewBox="-1.1 -1.1 2.2 2.2"
      strokeWidth={`${props.strokeWidth}%`}
      vel={vel}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ backgroundColor: props.backgroundColor, maxHeight: '70vh' }}
    >
      <path ref={pathRef} stroke={props.color} d={dPath} />
    </StyledSvg>
  )
}

// const MemoizedSpiroCanvas = memo(SpiroCanvas)
const ForwardSpiroCanvas = forwardRef(SpiroCanvas)

export default ForwardSpiroCanvas
