
import { Button } from 'antd';
import Icon from './Icon';

interface OptionPickerProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: {
    label: string;
    value: string | number;
    icon: string;
  }[];
}

function OptionPicker(props: OptionPickerProps) {

  function handleOptionClick(value: string | number) {
    props.onChange?.(value);
  }

  return (
    <div className='flex gap-8'>
      {props.options.map((option) => (
        <Button 
          type={props.value === option.value ? 'primary' : 'default'}
          icon={<Icon path={option.icon} title={option.label} />}
          onClick={() => handleOptionClick(option.value)}
          key={option.value}
        />
      ))}
    </div>
  );
}

export default OptionPicker;
