import { useMemo } from 'react'
import OptionPicker, { Option } from '@/ui-kit/OptionPicker'
import { normalizeValue } from './formUtils'
import dAttributes from '../../icons/dAttribute.json'

const dAttr: Record<string, string> = dAttributes

interface FriendlyLapsSettingsProps {
  distance: number
  lapsValues: number[]
  value?: number
  onChange: (laps: number) => void
}

const knownDistanceValues = [0.1, 0.3, 0.5, 0.7, 0.9]

function FriendlyLapsSettings(props: FriendlyLapsSettingsProps) {
  const curlingOptions: Option[] = useMemo(() => {
    const options: Option[] = []
    let distance = props.distance
    if (!knownDistanceValues.includes(props.distance)) {
      // find closest value
      let diff = Infinity
      for (let i = 0; i < knownDistanceValues.length; i++) {
        const newDiff = Math.abs(knownDistanceValues[i] - props.distance)
        if (newDiff < diff) {
          diff = newDiff
          distance = knownDistanceValues[i]
        }
      }
    }
    for (let i = 0; i < props.lapsValues.length; i++) {
      const normalizedValue = normalizeValue(i, props.lapsValues.length, 6)
      const key = `l${normalizedValue}-${distance}`
      options.push({
        value: props.lapsValues[i],
        icon: dAttr[key],
      })
    }
    return options
  }, [props.lapsValues, props.distance])

  return (
    <OptionPicker
      options={curlingOptions}
      onChange={props.onChange}
      value={props.value}
      iconProps={{ stroke: true }}
    />
  )
}

export default FriendlyLapsSettings
