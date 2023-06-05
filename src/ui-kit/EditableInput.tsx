import {
  Input as AntdInput,
  InputProps as AntdInputProps,
  InputRef,
} from 'antd'
import { useRef } from 'react'
import Icon from './Icon'
import { mdiPencil } from '@mdi/js'
import styled from 'styled-components'
import { useThemeContext } from '@/contexts/ThemeContext'

const StyledInput = styled(AntdInput)<{ $advanced: boolean }>`
  .ant-input:first-child {
    border-start-end-radius: 6px;
    border-end-end-radius: 6px;
  }
  .ant-input:focus {
    border-start-end-radius: 0px;
    border-end-end-radius: 0px;
    border-right: none;
    box-shadow: none;
  }
  .ant-input-group-addon {
    display: none;
  }
  // .ant-input-group-addon is beside a focused input
  .ant-input:focus + .ant-input-group-addon {
    background-color: #141414;
    border-color: ${(props) => (props.$advanced ? '#8c20ba' : '#20bab4')};
    display: table-cell;
  }
`

interface EditableInputProps extends Omit<AntdInputProps, 'onChange' | 'id'> {
  onChange: (value: string) => void
  id: number
  name: string
}

function EditableInput(props: EditableInputProps) {
  const { advanced } = useThemeContext()
  const inputRef = useRef<InputRef>(null)

  function handleEdit() {
    if (
      inputRef.current?.input?.value &&
      inputRef.current?.input?.value !== props.name
    ) {
      props.onChange(inputRef.current.input.value)
    }
  }

  const { addonAfter, id, name, onChange, ...rest } = props
  return (
    <StyledInput
      $advanced={advanced}
      key={id}
      ref={inputRef}
      type="text"
      placeholder="Name"
      defaultValue={name}
      addonAfter={
        <div onClick={handleEdit} className="cursor-pointer font-10">
          <Icon path={mdiPencil} />
        </div>
      }
      onBlur={handleEdit}
      {...rest}
    />
  )
}

export default EditableInput
