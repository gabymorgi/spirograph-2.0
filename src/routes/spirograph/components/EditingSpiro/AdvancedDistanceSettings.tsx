import LazySlider from '@/ui-kit/LazySlider'

interface AdvancedDistanceSettingsProps {
  laps: number
  value?: number
  onChange: (distance: number) => void
}

const defaultMarks = {
  0.1: '10%',
  0.3: '30%',
  0.5: '50%',
  0.7: '70%',
  0.9: '90%',
}

function AdvancedDistanceSettings(props: AdvancedDistanceSettingsProps) {
  return (
    <LazySlider
      min={0}
      max={1}
      step={0.01}
      marks={defaultMarks}
      tooltip={{
        formatter: (value?: number) => `${((value || 0) * 100).toFixed()}%`,
      }}
      value={props.value}
      onChangeComplete={props.onChange}
    />
  )
}

export default AdvancedDistanceSettings
