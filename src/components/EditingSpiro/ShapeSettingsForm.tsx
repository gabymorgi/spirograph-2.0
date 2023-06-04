import { Button, Form, InputNumber, Select, Slider } from 'antd'
import { SpiroAnimationSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix, mdiGesture } from '@mdi/js'
import { useEffect } from 'react'
import { SpiroParam } from '@/utils/queryParamsUtils'
import { useQueryParams } from 'use-query-params'
import { getUniqueSpirographName } from '@/utils/canvasUtils'

interface ShapeSettingsFormStore {
  laps: number
  petals: number
  pointDistancePercentage: number
}

function ShapeSettingsForm() {
  const [form] = Form.useForm()
  const [query, setQuery] = useQueryParams(SpiroParam)
  const spiro = query as SpiroAnimationSettings
  function handleFinish(values: ShapeSettingsFormStore) {
    setQuery({ ...values, name: getUniqueSpirographName(values) }, 'replaceIn')
  }

  useEffect(() => {
    form.setFieldsValue({
      laps: spiro.laps,
      petals: spiro.petals,
      pointDistancePercentage: spiro.pointDistancePercentage,
    })
  }, [spiro.laps, spiro.petals, spiro.pointDistancePercentage])

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
