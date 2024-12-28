import { StringParam, NumberParam, withDefault } from 'use-query-params'
import {
  defaultBackgroundColor,
  defaultColor,
  defaultLaps,
  defaultMsPerPetal,
  defaultPetals,
  defaultPointDistancePercentage,
  defaultStrokeWidthPercentage,
  getIncrementalId,
} from './constants'

export const SpiroParam = {
  id: withDefault(NumberParam, getIncrementalId()),
  name: withDefault(StringParam, 'My Spiro'),
  laps: withDefault(NumberParam, defaultLaps),
  petals: withDefault(NumberParam, defaultPetals),
  pointDistancePercentage: withDefault(
    NumberParam,
    defaultPointDistancePercentage,
  ),
  strokeWidthPercentage: withDefault(NumberParam, defaultStrokeWidthPercentage),
  color: withDefault(StringParam, defaultColor),
  backgroundColor: withDefault(StringParam, defaultBackgroundColor),
  msPerPetal: withDefault(NumberParam, defaultMsPerPetal),
}
