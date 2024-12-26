import {
  InputNumber as AntdInputNumber,
  InputNumberProps,
  Slider,
  SliderSingleProps,
} from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

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

const StylesInputNumber = styled.div`
  display: flex;
  gap: 8px;

  .ant-input-number {
    width: 70px;
  }

  .ant-slider {
    flex: 1;
  }
`

function InputNumber(props: InputNumberProps) {
  function handleChange(value: number | string | null) {
    props.onChange?.(value)
  }

  return (
    <StylesInputNumber>
      <AntdInputNumber {...props} value={props.value} onChange={handleChange} />
      <LazySlider
        min={Number(props.min)}
        max={Number(props.max)}
        value={Number(props.value || props.min)}
        onAfterChange={handleChange}
      />
    </StylesInputNumber>
  )
}

export default InputNumber
