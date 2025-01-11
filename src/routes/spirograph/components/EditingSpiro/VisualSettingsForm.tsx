import { Form } from 'antd'
import { SpiroAnimationSettings } from '@/utils/types'
import OptionPicker from '@/ui-kit/OptionPicker'
import ColorPicker from '@/ui-kit/ColorPicker'
import { useEffect } from 'react'
import {
  animationSpeedOptions,
  thicknessOptions,
} from './formOptions'

interface VisualSettingsFormStore {
  color: string
  backgroundColor: string
  strokeWidth: number
  msPerPetal: number
}

interface VisualSettingsFormProps {
  spiro: SpiroAnimationSettings
  onEdit: (partialSpiro: Partial<VisualSettingsFormStore>) => void
}

function VisualSettingsForm(props: VisualSettingsFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      color: props.spiro.color,
      backgroundColor: props.spiro.backgroundColor,
      strokeWidth: props.spiro.strokeWidth,
      msPerPetal: props.spiro.msPerPetal,
    })
  }, [
    props.spiro.color,
    props.spiro.backgroundColor,
    props.spiro.strokeWidth,
    props.spiro.msPerPetal,
    form,
  ])

  return (
    <div className="flex flex-col">
      <Form layout="vertical" form={form}>
        <div className="flex gap-16">
          <Form.Item label="Line:" name="color">
            <ColorPicker
              onChange={(_value, hex) => props.onEdit({ color: hex })}
            />
          </Form.Item>
          <Form.Item label="Background:" name="backgroundColor">
            <ColorPicker
              onChange={(_value, hex) => props.onEdit({ backgroundColor: hex })}
            />
          </Form.Item>
        </div>
        <Form.Item label="thickness:" name="strokeWidth">
          <OptionPicker
            options={thicknessOptions}
            onChange={(value) =>
              props.onEdit({ strokeWidth: Number(value) })
            }
          />
        </Form.Item>
        <Form.Item label="Animation speed:" name="msPerPetal">
          <OptionPicker
            options={animationSpeedOptions}
            onChange={(msPerPetal: string | number) =>
              props.onEdit({ msPerPetal: Number(msPerPetal) })
            }
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default VisualSettingsForm
