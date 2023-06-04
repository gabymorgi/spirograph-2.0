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
import { useQueryParams } from 'use-query-params'
import { SpiroParam } from '@/utils/queryParamsUtils'
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

function VisualSettingsForm() {
  const [form] = Form.useForm()
  const [query, setQuery] = useQueryParams(SpiroParam)
  const spiro = query as SpiroAnimationSettings

  function handleChangeWidth(width: string | number) {
    setQuery({ strokeWidth: Number(width) }, 'replaceIn')
  }

  function handleChangeDetail(detail: string | number) {
    setQuery({ stepPerLap: Number(detail) }, 'replaceIn')
  }

  function handleChangeInterpolation(interpolation: string | number) {
    setQuery({ interpolation: interpolation as Interpolation }, 'replaceIn')
  }

  function handleChangeSpeed(msPerPetal: string | number) {
    setQuery({ msPerPetal: Number(msPerPetal) }, 'replaceIn')
  }

  function handleChangeColor(_value: Color, hex: string) {
    setQuery({ color: hex }, 'replaceIn')
  }

  function handleChangeBackgroundColor(_value: Color, hex: string) {
    setQuery({ backgroundColor: hex }, 'replaceIn')
  }

  useEffect(() => {
    form.setFieldsValue({
      color: spiro.color,
      backgroundColor: spiro.backgroundColor,
      strokeWidth: spiro.strokeWidth,
      stepPerLap: spiro.stepPerLap,
      interpolation: spiro.interpolation,
      msPerPetal: spiro.msPerPetal,
    })
  }, [
    spiro.color,
    spiro.backgroundColor,
    spiro.strokeWidth,
    spiro.stepPerLap,
    spiro.interpolation,
    spiro.msPerPetal,
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
