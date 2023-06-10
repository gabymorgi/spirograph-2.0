import Button from './Button'
import Icon from './Icon'

export interface Option {
  label: string
  value: string | number
  icon: string
}

interface OptionPickerProps {
  value?: string | number
  onChange?: (value: string | number) => void
  options: Option[]
}

function OptionPicker(props: OptionPickerProps) {
  function handleOptionClick(value: string | number) {
    props.onChange?.(value)
  }

  return (
    <div className="flex gap-8">
      {props.options.map((option) => (
        <Button
          tooltip={option.label}
          type={props.value === option.value ? 'primary' : 'default'}
          icon={<Icon path={option.icon} />}
          onClick={() => handleOptionClick(option.value)}
          key={option.label}
        />
      ))}
    </div>
  )
}

export default OptionPicker
