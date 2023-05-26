import { useMemo } from "react";

type Interpolation = 'linear' | 'cuadratic'

interface SpiroSVGProps {
  a: number;
  r: number;
  d: number;
  interpolation: Interpolation;
}

type Point = {
  x: number;
  y: number;
};

function calculateSpirographPoint(a: number, r: number, d: number, t: number): Point {
  const x = (a - r) * Math.cos(t) + d * Math.cos(((a - r) / r) * t);
  const y = (a - r) * Math.sin(t) - d * Math.sin(((a - r) / r) * t);

  return { x, y };
}

function calculateSpirographPoints(a: number, r: number, d: number): Point[] {
  const points: Point[] = [];
  const step = 0.1;
  const max = 2 * Math.PI;
  for (let t = 0; t < max; t += step) {
    points.push(calculateSpirographPoint(a, r, d, t));
  }
  return points;
}

function SpiroSVG(props: SpiroSVGProps) {
  const path = useMemo(() => {
    const points = calculateSpirographPoints(props.a, props.r, props.d);
    const pathParts = points.map((point, index) => {
      const tenthPoint = { x: point.x * 10, y: point.y * 10 }
      if (index === 0) {
        return `M ${point.x * 10} ${point.y * 10}`;
      } else if (props.interpolation === 'linear') {
        return `L ${point.x * 10} ${point.y * 10}`;
      } else {
        const prevPoint = points[index - 1];
        const nextPoint = points[index + 1] || points[0];
        return `Q ${point.x * 10} ${point.y * 10}, ${nextPoint.x * 10} ${nextPoint.y * 10}`;
      }
    })
    // add las point to close the path
    pathParts.push('Z');
    return pathParts.join(' ');
  }, [props.a, props.r, props.d]);
  return (
    <svg viewBox="-100 -100 200 200" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={path} stroke="white" />
    </svg>
  );
}

export default SpiroSVG;