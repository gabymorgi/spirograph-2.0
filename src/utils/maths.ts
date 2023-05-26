import { Line, Point } from "./maths.type";

export function getSlope(p1: Point, p2: Point): number {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

export function getIntersection(line1: Line, line2: Line): Point {
  const slope1 = getSlope(line1.p1, line1.p2);
  const slope2 = getSlope(line2.p1, line2.p2);

  const x = (slope1 * line1.p1.x - slope2 * line2.p1.x - line1.p1.y + line2.p1.y) / (slope1 - slope2);
  const y = slope1 * (x - line1.p1.x) + line1.p1.y;

  return { x, y };
}

export function derivativeOnPoint(prevPoint: Point, nextPoint: Point): number {
  return (nextPoint.y - prevPoint.y) / (nextPoint.x - prevPoint.x);
}