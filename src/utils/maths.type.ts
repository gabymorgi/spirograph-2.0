export type Point = {
  x: number;
  y: number;
};

export type Line = {
  point: Point;
  slope: number;
};

export type LineSegment = {
  p1: Point;
  p2: Point;
};

export type Interpolation = "linear" | "bezier" | "derivative";

export type PathChunk = {
  command: 'M' | 'L' | 'Q' | 'Z';
  points: Point[];
};

export type SpirographSettings = {
  movingRadius: number;
  pointDistance: number;
  step: number;
  interpolation: Interpolation;
  color: string;
  backgroundColor: string;
}

export type Dict<T> = {
  [key: string]: T;
}
