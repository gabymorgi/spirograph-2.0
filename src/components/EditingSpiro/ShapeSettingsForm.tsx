import { Button, Form, InputNumber, Select, Slider } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix, mdiGesture } from '@mdi/js'
import { useEffect } from 'react'

interface ShapeSettingsFormStore {
  laps: number
  petals: number
  pointDistancePercentage: number
}

interface ShapeSettingsFormProps {
  spiro: SpiroSettings
  onEdit: (partialSpiro: ShapeSettingsFormStore) => void
}

function ShapeSettingsForm(props: ShapeSettingsFormProps) {
  const [form] = Form.useForm()
  function handleFinish(values: ShapeSettingsFormStore) {
    props.onEdit(values)
  }

  useEffect(() => {
    form.setFieldsValue({
      laps: props.spiro.laps,
      petals: props.spiro.petals,
      pointDistancePercentage: props.spiro.pointDistancePercentage,
    })
  }, [
    props.spiro.laps,
    props.spiro.petals,
    props.spiro.pointDistancePercentage,
  ])

  return (
    <div className="flex flex-col">
      <Form form={form} onFinish={handleFinish} layout="vertical">
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
