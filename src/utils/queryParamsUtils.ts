import { StringParam, NumberParam, withDefault } from 'use-query-params'
import {
  defaultColor,
  defaultLaps,
  defaultMsPerPetal,
  defaultPetals,
  defaultDistance,
  defaultstrokeWidth,
  getIncrementalId,
} from './constants'

export const SpiroParam = {
  id: withDefault(NumberParam, getIncrementalId()),
  name: withDefault(StringParam, 'My Spiro'),
  laps: withDefault(NumberParam, defaultLaps),
  petals: withDefault(NumberParam, defaultPetals),
  distance: withDefault(NumberParam, defaultDistance),
  strokeWidth: withDefault(NumberParam, defaultstrokeWidth),
  color: withDefault(StringParam, defaultColor),
  msPerPetal: withDefault(NumberParam, defaultMsPerPetal),
}
