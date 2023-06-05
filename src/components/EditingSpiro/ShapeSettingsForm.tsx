import { Button, Form, InputNumber, Select, Slider } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import {
  mdiAutoFix,
  mdiGesture,
  mdiVectorPolygon,
  mdiVectorSquare,
  mdiVectorTriangle,
} from '@mdi/js'
import { useEffect } from 'react'
import OptionPicker from '@/ui-kit/OptionPicker'
import { getSuggestedStepsPerLap, getMovingRadius } from '@/utils/maths'
import { getHypotrochoidPoint } from '@/utils/functions'
import { HYPOTROCHOID_FIXED_RADIUS } from '@/utils/constants'

interface DetailOption {
  label: string
  value: number
  icon: string
}

interface ShapeSettingsFormStore {
  laps: number
  petals: number
  pointDistancePercentage: number
  stepPerLap: number
}

interface ShapeSettingsFormProps {
  spiro: SpiroSettings
  onEdit: (partialSpiro: ShapeSettingsFormStore) => void
}

const detailOptions: DetailOption[] = [
  { label: 'low', value: 0, icon: mdiVectorTriangle },
  { label: 'medium', value: 1, icon: mdiVectorSquare },
  { label: 'high', value: 2, icon: mdiVectorPolygon },
]

function ShapeSettingsForm(props: ShapeSettingsFormProps) {
  const [form] = Form.useForm()

  function handleFinish(values: ShapeSettingsFormStore) {
    const movingRadius = getMovingRadius(
      HYPOTROCHOID_FIXED_RADIUS,
      values.petals,
      values.laps,
    )
    const pointDistance = (movingRadius / 100) * values.pointDistancePercentage
    const step = getSuggestedStepsPerLap(
      (t) =>
        getHypotrochoidPoint(
          HYPOTROCHOID_FIXED_RADIUS,
          movingRadius,
          pointDistance,
          t,
        ),
      [0.1, 1],
    )
    let stepOptions: number[] = []
    if (step === 2) {
      stepOptions = [2, 3, 4]
    } else if (step === 3) {
      stepOptions = [2, 3, 6]
    } else {
      stepOptions = [Math.round(step * 0.5), step, step * 2]
    }
    props.onEdit({
      ...values,
      stepPerLap: stepOptions[values.stepPerLap],
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      laps: props.spiro.laps,
      petals: props.spiro.petals,
      pointDistancePercentage: props.spiro.pointDistancePercentage,
    })
  }, [
    form,
    props.spiro.laps,
    props.spiro.petals,
    props.spiro.pointDistancePercentage,
  ])

  return (
    <div className="flex flex-col">
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{ type: 'Hypocycloid' }}
      >
        <Form.Item label="Curve type" name="type">
          <Select disabled>
            <Select.Option value="Hypocycloid">Hypocycloid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Cantidad de petalos" name="petals">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Rotaciones" name="laps">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Tamaño de los petalos"
          name="pointDistancePercentage"
          rules={[
            {
              required: true,
              message: 'Please input the petals size',
            },
          ]}
        >
          <Slider min={0} max={100} />
        </Form.Item>
        <Form.Item
          label="Detail:"
          name="stepPerLap"
          tooltip="Cantidad de puntos que se dibujan"
        >
          <OptionPicker options={detailOptions} />
        </Form.Item>
        <Button icon={<Icon path={mdiAutoFix} />}>I feel lucky</Button>
        <Button
          icon={<Icon path={mdiGesture} />}
          type="primary"
          htmlType="submit"
        >
          Draw it!
        </Button>
      </Form>
    </div>
  )
}

export default ShapeSettingsForm
