import { Slider, SliderSingleProps } from 'antd'
import { useEffect, useState } from 'react'

function LazySlider(props: SliderSingleProps) {
  const [value, setValue] = useState(props.defaultValue)

  function handleChange(value: number) {
    setValue(value)
  }

  useEffect(() => {
    if (props.value === undefined) return
    setValue(props.value)
  }, [props.value])

  return <Slider {...props} value={value} onChange={handleChange} />
}

export default LazySlider
