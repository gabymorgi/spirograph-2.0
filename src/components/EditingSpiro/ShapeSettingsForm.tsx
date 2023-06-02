import { Button, Form, InputNumber, Select } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix, mdiGesture } from '@mdi/js'
import { useMemo } from 'react'

interface ShapeSettingsFormStore {
  laps: number
  petals: number
  pointDistance: number
}

interface ShapeSettingsFormProps {
  spiro: SpiroSettings
  onEdit: (partialSpiro: ShapeSettingsFormStore) => void
}

function ShapeSettingsForm(props: ShapeSettingsFormProps) {
  function handleFinish(values: ShapeSettingsFormStore) {
    props.onEdit({
      laps: values.laps,
      petals: values.petals,
      pointDistance: values.pointDistance,
    })
  }

  const initialValues: ShapeSettingsFormStore = useMemo(() => {
    return {
      laps: props.spiro.laps,
      petals: props.spiro.petals,
      pointDistance: props.spiro.pointDistance,
    }
  }, [props.spiro])

  return (
    <div className="flex flex-col">
      <Form
        onFinish={handleFinish}
        initialValues={initialValues}
        layout="vertical"
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
          name="pointDistance"
          rules={[
            {
              required: true,
              message: 'Please input the petals size',
            },
          ]}
        >
          <InputNumber />
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
