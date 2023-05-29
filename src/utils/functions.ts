import { HYPOTROCHOID_FIXED_RADIUS } from "./constants";
import { getLaps } from "./maths";
import { Point } from "./maths.type";

export function calculateSpirographPoints(
  movingRadius: number,
  pointDistance: number,
  pointsPerLap: number
): Point[] {
  const points: Point[] = [];
  const step = 2 * Math.PI / pointsPerLap;
  console.log(pointsPerLap, step);
  
  console.log(HYPOTROCHOID_FIXED_RADIUS, movingRadius)
  let max = getLaps(HYPOTROCHOID_FIXED_RADIUS, movingRadius) * pointsPerLap;
  console.log(max)
  let t = 0;
  for (; max > 0; max--) {
    points.push(getHypotrochoidPoint(HYPOTROCHOID_FIXED_RADIUS, movingRadius, pointDistance, t));
    t += step;
  }
  console.log(points.length)
  return points;
}

export function getHypotrochoidPoint(
  fixedRadius: number,
  movingRadius: number,
  pointDistance: number,
  t: number,
  multiplier = 1
): Point {
  const radiusDifference = fixedRadius - movingRadius;
  const radiusRatio = radiusDifference / movingRadius;
  const x =
    radiusDifference * Math.cos(t) + pointDistance * Math.cos(radiusRatio * t);
  const y =
    radiusDifference * Math.sin(t) - pointDistance * Math.sin(radiusRatio * t);

  return { x: x * multiplier, y: y * multiplier };
}