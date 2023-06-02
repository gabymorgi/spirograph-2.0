export type Point = {
  x: number
  y: number
}

export type Line = {
  point: Point
  slope: number
}

export type LineSegment = {
  p1: Point
  p2: Point
}

export enum Interpolation {
  Linear = 'linear',
  Bezier = 'bezier',
  Derivative = 'derivative',
}

export type PathChunk = {
  command: 'M' | 'L' | 'Q' | 'Z'
  points: Point[]
}

export interface SpiroSettings {
  id: number
  name: string
  movingRadius: number
  pointDistance: number
  stepPerLap: number
  interpolation: Interpolation
  color: string
  backgroundColor: string
  strokeWidth: number
}

export interface SpiroAnimationSettings extends SpiroSettings {
  msPerLap: number
}

export type Dict<T> = {
  [key: string]: T
}
