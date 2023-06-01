import { useEffect, useCallback, useMemo, useState, useRef, memo, useImperativeHandle, forwardRef, } from "react";
import { calculateSpirographPoints, recalculateViewBox } from "@/utils/functions";
import { getPath, pathChunkToString, pathChunksToString } from "@/utils/canvasUtils";
import { SpiroAnimationSettings, SpiroSettings } from "@/utils/types";
import { toPng } from "html-to-image";

export interface SpiroCanvasHandle {
  redraw: () => void;
  download: () => void;
}

type SpiroCanvasProps = Partial<SpiroAnimationSettings> & SpiroSettings

const SpiroCanvas: React.ForwardRefRenderFunction<SpiroCanvasHandle, SpiroCanvasProps> = (props, ref) => {
  const animationId = useRef<number | null>(null);
  const animationFinished = useRef<boolean>(false);
  const animationIndex = useRef<number>(0);
  const svgRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [viewBox, setViewBox] = useState(recalculateViewBox(props));

  console.log('SpiroCanvas', props)

  const { pathChunks, msPerStep } = useMemo(() => {
    const { points, laps } = calculateSpirographPoints(
      props.movingRadius,
      props.pointDistance,
      props.stepPerLap
    );
    const msPerLap = props.msPerLap || 0
    return {
      pathChunks: getPath(points, props.interpolation),
      msPerStep: msPerLap ? (msPerLap * laps) / points.length : 0
    }
  }, [props.interpolation, props.movingRadius, props.pointDistance, props.stepPerLap]);

  useEffect(() => {
    setViewBox(recalculateViewBox(props));
  }, [props.movingRadius, props.pointDistance]);

  const startAnimation = useCallback(() => {
    pathRef.current?.setAttribute('d', "")
    animationFinished.current = false
    animationIndex.current = 0
    if (!('msPerLap' in props) || msPerStep < 1) {
      pathRef.current?.setAttribute('d', pathChunksToString(pathChunks))
      return
    }

    let start: number | null = null;
  
    function step(timestamp: number) {
      if (!start) start = timestamp;
      console.log('step', timestamp, start, msPerStep)
  
      if (timestamp - start > msPerStep) {
        let path = pathRef.current?.getAttribute('d') || ''
        while (timestamp - start > msPerStep) {
          start += msPerStep;
    
          if (animationIndex.current < pathChunks.length) {
            path += pathChunkToString(pathChunks[animationIndex.current])
            
            animationIndex.current += 1;
          } else {
            animationFinished.current = true
            break
          }
        }
        pathRef.current?.setAttribute('d', path)
      }
  
      if (animationIndex.current < pathChunks.length) {
        animationId.current = requestAnimationFrame(step);
      }
    }
  
    animationId.current = requestAnimationFrame(step);
  }, [pathChunks, msPerStep]);

  useImperativeHandle(ref, () => ({
    redraw: () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
      startAnimation()
    },
    download: handleDownload,
  }));

  useEffect(() => {
    if (animationFinished.current) {
      return
    }
    startAnimation()
  
    return () => {
      animationId.current ? cancelAnimationFrame(animationId.current) : null;
    };
  }, [startAnimation]);
  

  const handleDownload = useCallback(() => {
    if (svgRef.current === null) {
      return
    }

    toPng(svgRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${props.name}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  return (
    <svg
      ref={svgRef as any}
      viewBox={viewBox}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={props.strokeWidth}
      style={{ backgroundColor: props.backgroundColor }}
    >
      <path ref={pathRef} d="" stroke={props.color} />
    </svg>
  );
}

const ForwardSpiroCanvas = forwardRef(SpiroCanvas)

export default memo(ForwardSpiroCanvas)
