import { useMemo } from 'react'
import { SliderSingleProps } from 'antd'
import LazySlider from '@/ui-kit/LazySlider'
import { selectEvenlySpacedValues } from '@/utils/maths'

interface AdvancedLapsSettingsProps {
  lapsValues: number[]
  value?: number
  onChange: (laps: number) => void
}

function AdvancedLapsSettings(props: AdvancedLapsSettingsProps) {
  const marks: SliderSingleProps['marks'] = useMemo(() => {
    const withLabels: Record<number, boolean> = {}
    selectEvenlySpacedValues(props.lapsValues, 6).forEach((value) => {
      withLabels[value] = true
    })
    const marks: SliderSingleProps['marks'] = {}
    props.lapsValues.forEach((value) => {
      marks[value] = {
        style: withLabels[value]
          ? undefined
          : {
              color: 'transparent',
            },
        label: value.toString(),
      }
    })
    return marks
  }, [props.lapsValues])

  return (
    <LazySlider
      min={1}
      max={props.lapsValues[props.lapsValues.length - 1]}
      marks={marks}
      step={null}
      value={props.value}
      onChangeComplete={props.onChange}
    />
  )
}

export default AdvancedLapsSettings
