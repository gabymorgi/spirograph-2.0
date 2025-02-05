import Button from './Button'
import Icon from './Icon'

export interface Option {
  label?: string
  value: string | number
  icon: string
}

interface OptionPickerProps {
  value?: number
  onChange?: (value: number) => void
  options: Option[]
  iconProps?: {
    stroke?: boolean
    fill?: boolean
  }
}

function OptionPicker(props: OptionPickerProps) {
  function handleOptionClick(value: number) {
    props.onChange?.(value)
  }

  return (
    <div className="flex gap-8">
      {props.options.map((option) => (
        <Button
          // tooltip={option.label}
          type={props.value === option.value ? 'primary' : 'default'}
          icon={<Icon path={option.icon} {...props.iconProps} />}
          onClick={() => handleOptionClick(Number(option.value))}
          key={option.label || option.value}
        />
      ))}
    </div>
  )
}

export default OptionPicker
