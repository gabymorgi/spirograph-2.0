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

export type PathChunk = {
  command: 'M' | 'L' | 'Q' | 'C' | 'Z'
  points: Point[]
}

export interface SpiroSettings {
  id: number
  name: string
  laps: number
  petals: number
  distance: number
  color: string
  backgroundColor: string
  strokeWidth: number
}

export function isSpiroSetting(arg: any): arg is SpiroSettings {
  return (
    arg &&
    typeof arg.id === 'number' &&
    typeof arg.name === 'string' &&
    typeof arg.laps === 'number' &&
    typeof arg.petals === 'number' &&
    typeof arg.distance === 'number' &&
    typeof arg.color === 'string' &&
    typeof arg.backgroundColor === 'string' &&
    typeof arg.strokeWidth === 'number'
  )
}

export interface SpiroAnimationSettings extends SpiroSettings {
  msPerPetal: number
}

export type Dict<T> = { [key: string | number]: T }
