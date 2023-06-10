import { StringParam, NumberParam, withDefault } from 'use-query-params'
import {
  defaultBackgroundColor,
  defaultColor,
  defaultInterpolation,
  defaultLaps,
  defaultMsPerPetal,
  defaultPetals,
  defaultPointDistancePercentage,
  defaultStepPerLap,
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
  interpolation: withDefault(StringParam, defaultInterpolation),
  stepPerLap: withDefault(NumberParam, defaultStepPerLap),
  strokeWidthPercentage: withDefault(NumberParam, defaultStrokeWidthPercentage),
  color: withDefault(StringParam, defaultColor),
  backgroundColor: withDefault(StringParam, defaultBackgroundColor),
  msPerPetal: withDefault(NumberParam, defaultMsPerPetal),
}
