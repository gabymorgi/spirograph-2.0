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
  mdiVectorPolygon,
  mdiVectorSquare,
  mdiVectorTriangle,
} from '@mdi/js'
import OptionPicker from '@/ui-kit/OptionPicker'
import ColorPicker from '@/ui-kit/ColorPicker'
import { Color } from 'antd/es/color-picker'
import { useEffect } from 'react'

const thicknessOptions = [
  { label: 'thin', value: 10, icon: mdiCircleSmall },
  { label: 'medium', value: 50, icon: mdiCircleMedium },
  { label: 'thick', value: 100, icon: mdiCircle },
]

const detailOptions = [
  { label: 'low', value: 10, icon: mdiVectorTriangle },
  { label: 'medium', value: 20, icon: mdiVectorSquare },
  { label: 'high', value: 50, icon: mdiVectorPolygon },
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

  function handleChangeWidth(width: string | number) {
    props.onEdit({ strokeWidth: Number(width) })
  }

  function handleChangeDetail(detail: string | number) {
    props.onEdit({ stepPerLap: Number(detail) })
  }

  function handleChangeInterpolation(interpolation: string | number) {
    props.onEdit({ interpolation: interpolation as Interpolation })
  }

  function handleChangeSpeed(msPerPetal: string | number) {
    props.onEdit({ msPerPetal: Number(msPerPetal) })
  }

  function handleChangeColor(_value: Color, hex: string) {
    props.onEdit({ color: hex })
  }

  function handleChangeBackgroundColor(_value: Color, hex: string) {
    props.onEdit({ backgroundColor: hex })
  }

  useEffect(() => {
    form.setFieldsValue({
      color: props.spiro.color,
      backgroundColor: props.spiro.backgroundColor,
      strokeWidth: props.spiro.strokeWidth,
      stepPerLap: props.spiro.stepPerLap,
      interpolation: props.spiro.interpolation,
      msPerPetal: props.spiro.msPerPetal,
    })
  }, [
    props.spiro.color,
    props.spiro.backgroundColor,
    props.spiro.strokeWidth,
    props.spiro.stepPerLap,
    props.spiro.interpolation,
    props.spiro.msPerPetal,
  ])

  return (
    <div className="flex flex-col">
      <Form layout="vertical" form={form}>
        <div className="flex gap-16">
          <Form.Item label="Linea:" name="color" tooltip="Color de la línea">
            <ColorPicker onChange={handleChangeColor} />
          </Form.Item>
          <Form.Item
            label="Background:"
            name="backgroundColor"
            tooltip="Color de fondo"
          >
            <ColorPicker onChange={handleChangeBackgroundColor} />
          </Form.Item>
        </div>
        <Form.Item
          label="Grosor:"
          name="strokeWidth"
          tooltip="Grosor de la línea"
        >
          <OptionPicker
            options={thicknessOptions}
            onChange={handleChangeWidth}
          />
        </Form.Item>
        <Form.Item
          label="Detail:"
          name="stepPerLap"
          tooltip="Cantidad de puntos que se dibujan"
        >
          <OptionPicker options={detailOptions} onChange={handleChangeDetail} />
        </Form.Item>
        <Form.Item
          label="Transition:"
          name="interpolation"
          tooltip="Tipo de interpolación entre puntos"
        >
          <OptionPicker
            options={transitionOptions}
            onChange={handleChangeInterpolation}
          />
        </Form.Item>
        <Form.Item
          label="Animation speed:"
          name="msPerPetal"
          tooltip="Velocidad de la animación"
        >
          <OptionPicker
            options={animationSpeedOptions}
            onChange={handleChangeSpeed}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default VisualSettingsForm
