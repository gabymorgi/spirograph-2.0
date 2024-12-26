import { Form } from 'antd'
import { Interpolation, SpiroAnimationSettings } from '@/utils/types'
import OptionPicker from '@/ui-kit/OptionPicker'
import ColorPicker from '@/ui-kit/ColorPicker'
import { useEffect } from 'react'
import {
  animationSpeedOptions,
  thicknessOptions,
  transitionOptions,
} from './formOptions'

interface VisualSettingsFormStore {
  stepPerLap: number
  interpolation: Interpolation
  color: string
  backgroundColor: string
  strokeWidthPercentage: number
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
      strokeWidthPercentage: props.spiro.strokeWidthPercentage,
      interpolation: props.spiro.interpolation,
      msPerPetal: props.spiro.msPerPetal,
    })
  }, [
    props.spiro.color,
    props.spiro.backgroundColor,
    props.spiro.strokeWidthPercentage,
    props.spiro.interpolation,
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
        <Form.Item label="thickness:" name="strokeWidthPercentage">
          <OptionPicker
            options={thicknessOptions}
            onChange={(value) =>
              props.onEdit({ strokeWidthPercentage: Number(value) })
            }
          />
        </Form.Item>
        <Form.Item
          label="Transition:"
          name="interpolation"
          tooltip="Interpolations between points"
        >
          <OptionPicker
            options={transitionOptions}
            onChange={(interpolation: string | number) =>
              props.onEdit({ interpolation: interpolation as Interpolation })
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
