import { Option } from '@/ui-kit/OptionPicker'
import { Interpolation } from '@/utils/types'
import {
  mdiCircle,
  mdiCircleMedium,
  mdiCircleSmall,
  mdiHorseVariant,
  mdiRabbit,
  mdiSnail,
  mdiUnicorn,
  mdiVectorBezier,
  mdiVectorCurve,
  mdiVectorLine,
  mdiVectorPolygon,
  mdiVectorSquare,
  mdiVectorTriangle,
} from '@mdi/js'

import {
  curlierCurvier,
  curlierCurvy,
  curlierMedium,
  curlierSpikier,
  curlierSpiky,
  curliestCurvier,
  curliestCurvy,
  curliestMedium,
  curliestSpikier,
  curliestSpiky,
  curlyCurvier,
  curlyCurvy,
  curlyMedium,
  curlySpikier,
  curlySpiky,
  smoothCurvier,
  smoothCurvy,
  smoothMedium,
  smoothSpikier,
  smoothSpiky,
  smoothierCurvier,
  smoothierCurvy,
  smoothierMedium,
  smoothierSpikier,
  smoothierSpiky,
  smoothiestCurvier,
  smoothiestCurvy,
  smoothiestMedium,
  smoothiestSpikier,
  smoothiestSpiky,
} from '@/icons/iconPaths'

export const detailOptions: Option[] = [
  { label: 'low', value: 0, icon: mdiVectorTriangle },
  { label: 'medium', value: 1, icon: mdiVectorSquare },
  { label: 'high', value: 2, icon: mdiVectorPolygon },
]

export const thicknessOptions = [
  { label: 'thin', value: 0.2, icon: mdiCircleSmall },
  { label: 'medium', value: 0.4, icon: mdiCircleMedium },
  { label: 'thick', value: 1, icon: mdiCircle },
]

export const transitionOptions = [
  { label: 'linear', value: Interpolation.Linear, icon: mdiVectorLine },
  { label: 'bezier', value: Interpolation.Bezier, icon: mdiVectorCurve },
  {
    label: 'derivative',
    value: Interpolation.Derivative,
    icon: mdiVectorBezier,
  },
]

export const animationSpeedOptions = [
  { label: 'slow', value: 1000, icon: mdiSnail },
  { label: 'medium', value: 500, icon: mdiRabbit },
  { label: 'fast', value: 200, icon: mdiHorseVariant },
  { label: 'instant', value: 0, icon: mdiUnicorn },
]

export const lapsOptions: Option[] = [
  {
    label: 'smoothiest',
    value: 0,
    icon: smoothiestMedium,
  },
  {
    label: 'smoothier',
    value: 1,
    icon: smoothierMedium,
  },
  {
    label: 'smooth',
    value: 2,
    icon: smoothMedium,
  },
  {
    label: 'curly',
    value: 3,
    icon: curlyMedium,
  },
  {
    label: 'curlier',
    value: 4,
    icon: curlierMedium,
  },
  {
    label: 'curliest',
    value: 5,
    icon: curliestMedium,
  },
]

export const pointDistanceOptions: Array<Array<string>> = [
  [
    smoothiestCurvier,
    smoothiestCurvy,
    smoothiestMedium,
    smoothiestSpiky,
    smoothiestSpikier,
  ],
  [
    smoothierCurvier,
    smoothierCurvy,
    smoothierMedium,
    smoothierSpiky,
    smoothierSpikier,
  ],
  [smoothCurvier, smoothCurvy, smoothMedium, smoothSpiky, smoothSpikier],
  [curlyCurvier, curlyCurvy, curlyMedium, curlySpiky, curlySpikier],
  [curlierCurvier, curlierCurvy, curlierMedium, curlierSpiky, curlierSpikier],
  [
    curliestCurvier,
    curliestCurvy,
    curliestMedium,
    curliestSpiky,
    curliestSpikier,
  ],
]

export const pointDistanceBaseOptions: Option[] = [
  {
    label: 'curvier',
    value: 10,
    icon: smoothCurvier,
  },
  { label: 'curvy', value: 30, icon: smoothCurvy },
  {
    label: 'medium',
    value: 50,
    icon: smoothMedium,
  },
  { label: 'spiky', value: 70, icon: smoothSpiky },
  {
    label: 'spikier',
    value: 90,
    icon: smoothSpikier,
  },
]
