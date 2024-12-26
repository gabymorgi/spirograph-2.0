import { HYPOTROCHOID_FIXED_RADIUS } from '@/utils/constants'
import { getHypotrochoidPoint } from '@/utils/functions'
import { getMovingRadius, getSuggestedStepsPerLap } from '@/utils/maths'

interface getSelectedStepProps {
  petals: number
  laps: number
  pointDistancePercentage: number
  stepPerLap: number
}

export function getSelectedStep(props: getSelectedStepProps) {
  const movingRadius = getMovingRadius(
    HYPOTROCHOID_FIXED_RADIUS,
    props.petals,
    props.laps,
  )
  const pointDistance = (movingRadius / 100) * props.pointDistancePercentage

  const step = getSuggestedStepsPerLap(
    (t) =>
      getHypotrochoidPoint(
        HYPOTROCHOID_FIXED_RADIUS,
        movingRadius,
        pointDistance,
        t,
      ),
    [0.1, 1],
  )
  let stepOptions: number[] = []
  if (step === 2) {
    stepOptions = [2, 3, 4]
  } else if (step === 3) {
    stepOptions = [2, 3, 6]
  } else {
    stepOptions = [Math.round(step * 0.5), step, step * 2]
  }

  return stepOptions[props.stepPerLap]
}

export function normalizeValue(
  prevValue: number,
  prevMax: number,
  max: number,
) {
  return Math.round((prevValue / (prevMax - 1)) * (max - 1))
}
