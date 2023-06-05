import { Form } from 'antd'
import { Interpolation, SpiroAnimationSettings } from '@/utils/types'
import {
  mdiCircle,
  mdiCircleMedium,
  mdiCircleSmall,
  mdiHorseVariant,
  mdiRabbit,
  mdiSnail,
  mdiUnicorn,
  mdiVectorBezier,
  mdiVectorCurve,
  mdiVectorLine,
} from '@mdi/js'
import OptionPicker from '@/ui-kit/OptionPicker'
import ColorPicker from '@/ui-kit/ColorPicker'
import { useEffect } from 'react'

const thicknessOptions = [
  { label: 'thin', value: 10, icon: mdiCircleSmall },
  { label: 'medium', value: 50, icon: mdiCircleMedium },
  { label: 'thick', value: 100, icon: mdiCircle },
]

const transitionOptions = [
  { label: 'linear', value: Interpolation.Linear, icon: mdiVectorLine },
  { label: 'bezier', value: Interpolation.Bezier, icon: mdiVectorCurve },
  {
    label: 'derivative',
    value: Interpolation.Derivative,
    icon: mdiVectorBezier,
  },
]

const animationSpeedOptions = [
  { label: 'slow', value: 1000, icon: mdiSnail },
  { label: 'medium', value: 500, icon: mdiRabbit },
  { label: 'fast', value: 200, icon: mdiHorseVariant },
  { label: 'instant', value: 0, icon: mdiUnicorn },
]

interface VisualSettingsFormStore {
  stepPerLap: number
  interpolation: Interpolation
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
      interpolation: props.spiro.interpolation,
      msPerPetal: props.spiro.msPerPetal,
    })
  }, [
    props.spiro.color,
    props.spiro.backgroundColor,
    props.spiro.strokeWidth,
    props.spiro.interpolation,
    props.spiro.msPerPetal,
    form,
  ])

  return (
    <div className="flex flex-col">
      <Form layout="vertical" form={form}>
        <div className="flex gap-16">
          <Form.Item label="Linea:" name="color" tooltip="Color de la línea">
            <ColorPicker
              onChange={(_value, hex) => props.onEdit({ color: hex })}
            />
          </Form.Item>
          <Form.Item
            label="Background:"
            name="backgroundColor"
            tooltip="Color de fondo"
          >
            <ColorPicker
              onChange={(_value, hex) => props.onEdit({ backgroundColor: hex })}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Grosor:"
          name="strokeWidth"
          tooltip="Grosor de la línea"
        >
          <OptionPicker
            options={thicknessOptions}
            onChange={(value) => props.onEdit({ strokeWidth: Number(value) })}
          />
        </Form.Item>
        <Form.Item
          label="Transition:"
          name="interpolation"
          tooltip="Tipo de interpolación entre puntos"
        >
          <OptionPicker
            options={transitionOptions}
            onChange={(interpolation: string | number) =>
              props.onEdit({ interpolation: interpolation as Interpolation })
            }
          />
        </Form.Item>
        <Form.Item
          label="Animation speed:"
          name="msPerPetal"
          tooltip="Velocidad de la animación"
        >
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
