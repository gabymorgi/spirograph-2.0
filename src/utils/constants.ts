let incrementalId = Date.now()

export function getIncrementalId() {
  return incrementalId++
}

export const TWO_PI = Math.PI * 2
export const HALF_PI = Math.PI / 2

export const PADDING = 2 //100
export const MAX_VALUE = 120 //1000
export const CANVAS_MAX_VALUE = MAX_VALUE + PADDING
export const CANVAS_SIZE = CANVAS_MAX_VALUE * 2

export const HYPOTROCHOID_FIXED_RADIUS = MAX_VALUE

export const defaultPetals = 7
export const defaultLaps = 5
export const defaultDistance = 0.5
export const defaultstrokeWidth = 1
export const defaultColor = '#ffff00'
export const defaultMsPerPetal = 200
