import { useMemo } from 'react'
import OptionPicker, { Option } from '@/ui-kit/OptionPicker'
import { distanceBaseOptions } from './formOptions'
import { normalizeValue } from './formUtils'
import dAttributes from '../../icons/dAttribute.json'

const dAttr: Record<string, string> = dAttributes

interface FriendlyDistanceSettingsProps {
  laps: number
  lapsValues: number[]
  value?: number
  onChange: (distance: number) => void
}

function FriendlyDistanceSettings(props: FriendlyDistanceSettingsProps) {
  const spiknessOptions: Option[] = useMemo(() => {
    if (props.laps === null) return []
    let index = props.lapsValues.indexOf(props.laps)
    if (index === -1) {
      // find closest value
      let diff = Infinity
      for (let i = 0; i < props.lapsValues.length; i++) {
        const newDiff = Math.abs(props.lapsValues[i] - props.laps)
        if (newDiff < diff) {
          diff = newDiff
          index = i
        }
      }
    }
    const normalizedValue = normalizeValue(index, props.lapsValues.length, 6)
    return distanceBaseOptions.map((option) => ({
      ...option,
      icon: dAttr[`d${normalizedValue}-${option.value}`],
    }))
  }, [props.lapsValues, props.laps])

  return (
    <OptionPicker
      options={spiknessOptions}
      value={props.value}
      onChange={props.onChange}
      iconProps={{ stroke: true }}
    />
  )
}

export default FriendlyDistanceSettings
