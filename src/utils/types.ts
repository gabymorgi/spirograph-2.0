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
  laps: number
  petals: number
  pointDistancePercentage: number
  stepPerLap: number
  interpolation: Interpolation
  color: string
  backgroundColor: string
  strokeWidthPercentage: number
}

export function isSpiroSetting(arg: any): arg is SpiroSettings {
  return (
    arg &&
    typeof arg.id === 'number' &&
    typeof arg.name === 'string' &&
    typeof arg.laps === 'number' &&
    typeof arg.petals === 'number' &&
    typeof arg.pointDistancePercentage === 'number' &&
    typeof arg.stepPerLap === 'number' &&
    ['linear', 'bezier', 'derivative'].includes(arg.interpolation) &&
    typeof arg.interpolation === 'string' &&
    typeof arg.color === 'string' &&
    typeof arg.backgroundColor === 'string' &&
    typeof arg.strokeWidthPercentage === 'number'
  )
}

export interface SpiroAnimationSettings extends SpiroSettings {
  msPerPetal: number
}

export type Dict<T> = { [key: string | number]: T }
