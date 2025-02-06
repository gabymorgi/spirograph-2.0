import { InputNumber as AntdInputNumber, InputNumberProps } from 'antd'
import styled from 'styled-components'
import LazySlider from './LazySlider'

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
        onChangeComplete={handleChange}
      />
    </StylesInputNumber>
  )
}

export default InputNumber
