let incrementalId = Date.now()

export function getIncrementalId() {
  return incrementalId++
}

export const TWO_PI = Math.PI * 2
export const HALF_PI = Math.PI / 2

export const PADDING = 2 //100
export const MAX_VALUE = 28 //1000
export const CANVAS_MAX_VALUE = MAX_VALUE + PADDING
export const CANVAS_SIZE = CANVAS_MAX_VALUE * 2

// we are working with 1000x1000 canvas
// so to avoid precision errors, we consider infinity to be 1000 times bigger
export const INFINITY = 1000000

export const HYPOTROCHOID_FIXED_RADIUS = MAX_VALUE

export const defaultPetals = 67
export const defaultLaps = 53
export const defaultPointDistancePercentage = 50
export const defaultStrokeWidthPercentage = 0.4
export const defaultColor = '#ffff00'
export const defaultBackgroundColor = '#00000000'
export const defaultMsPerPetal = 200
