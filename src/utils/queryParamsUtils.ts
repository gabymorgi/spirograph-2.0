import { StringParam, NumberParam, withDefault } from 'use-query-params'
import { getIncrementalId } from './constants'
import { Interpolation } from './types'

export const SpiroParam = {
  id: withDefault(NumberParam, getIncrementalId()),
  name: withDefault(StringParam, 'My Spiro'),
  laps: withDefault(NumberParam, 4),
  petals: withDefault(NumberParam, 5),
  pointDistancePercentage: withDefault(NumberParam, 30),
  interpolation: withDefault(StringParam, Interpolation.Derivative),
  stepPerLap: withDefault(NumberParam, 44),
  strokeWidth: withDefault(NumberParam, 10),
  color: withDefault(StringParam, '#ffff00'),
  backgroundColor: withDefault(StringParam, '#00000000'),
  msPerPetal: withDefault(NumberParam, 200),
}
