import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { calculateSpirographPoints } from "../utils/functions";
import { getPath, pathChunkToString, pathChunksToString } from "../utils/canvasUtils";
import { HYPOTROCHOID_FIXED_RADIUS } from "../utils/constants";
import { Interpolation } from "../utils/maths.type";

interface SpiroSVGProps {
  movingRadius: number;
  pointDistance: number;
  interpolation: Interpolation;
  step: number;
  msPerStep?: number
}

function SpiroCanvas(props: SpiroSVGProps) {
  const animationId = useRef<number | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const pathChunks = useMemo(() => {
    const points = calculateSpirographPoints(
      props.movingRadius,
      props.pointDistance,
      props.step
    );
    return getPath(points, props.interpolation)
  }, [props.interpolation, props.movingRadius, props.pointDistance, props.step]);

  const viewBox = useMemo(() => {
    const max = HYPOTROCHOID_FIXED_RADIUS - (props.movingRadius - props.pointDistance);
    const maxWithPadding = max + 100;
    const width = maxWithPadding * 2;
    const viewBox = `${-maxWithPadding} ${-maxWithPadding} ${width} ${width}`;
    return viewBox;
  }, [props.movingRadius, props.pointDistance]);

  const startAnimation = useCallback(() => {
    setCurrentPath("")
    if (!props.msPerStep || props.msPerStep < 1) {
      setCurrentPath(pathChunksToString(pathChunks))
      return
    }

    let start: number | null = null;
    let currentIndex = 0;
  
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
  
      if (progress > Number(props.msPerStep)) {
        start = null;
  
        if (currentIndex < pathChunks.length) {
          const path = pathChunkToString(pathChunks[currentIndex])
          setCurrentPath((prevPathString) =>
            prevPathString + path
          );
          currentIndex += 1;
        }
      }
  
      if (currentIndex < pathChunks.length) {
        animationId.current = requestAnimationFrame(step);
      }
    }
  
    animationId.current = requestAnimationFrame(step);
  }, [pathChunks, props.msPerStep]);

  useEffect(() => {
    startAnimation()
  
    return () => {
      animationId.current ? cancelAnimationFrame(animationId.current) : null;
    };
  }, [startAnimation]);

  return (
    <svg
      viewBox={viewBox}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={10}
    >
      <path d={currentPath} stroke="white" />
    </svg>
  );
}

export default SpiroCanvas;
