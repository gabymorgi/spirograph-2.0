import { InputNumber as AntdInputNumber, InputNumberProps, Slider } from 'antd'
import styled from 'styled-components'

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
      <Slider
        min={Number(props.min)}
        max={Number(props.max)}
        defaultValue={Number(props.value)}
        onChangeComplete={handleChange}
      />
    </StylesInputNumber>
  )
}

export default InputNumber
