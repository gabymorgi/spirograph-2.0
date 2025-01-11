import { Option } from '@/ui-kit/OptionPicker'
import {
  mdiCircle,
  mdiCircleMedium,
  mdiCircleSmall,
  mdiHorseVariant,
  mdiRabbit,
  mdiSnail,
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
} from '@/routes/spirograph/icons/iconPaths'

export const thicknessOptions = [
  { label: 'thin', value: 0.5, icon: mdiCircleSmall },
  { label: 'medium', value: 1, icon: mdiCircleMedium },
  { label: 'thick', value: 2, icon: mdiCircle },
]

export const animationSpeedOptions = [
  { label: 'slow', value: 400, icon: mdiSnail },
  { label: 'medium', value: 200, icon: mdiRabbit },
  { label: 'fast', value: 100, icon: mdiHorseVariant },
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

export const distanceOptions: Array<Array<string>> = [
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

export const distanceBaseOptions: Option[] = [
  {
    label: 'curvier',
    value: 0.1,
    icon: smoothCurvier,
  },
  { label: 'curvy', value: 0.3, icon: smoothCurvy },
  {
    label: 'medium',
    value: 0.5,
    icon: smoothMedium,
  },
  { label: 'spiky', value: 0.7, icon: smoothSpiky },
  {
    label: 'spikier',
    value: 0.9,
    icon: smoothSpikier,
  },
]
