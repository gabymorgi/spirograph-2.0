import { Button, Form, Select } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix, mdiGesture } from '@mdi/js'
import { useEffect, useState, useRef } from 'react'
import OptionPicker, { Option } from '@/ui-kit/OptionPicker'
import { selectEvenlySpacedValues, nonCommonDivisors } from '@/utils/maths'
import {
  detailOptions,
  lapsOptions,
  pointDistanceBaseOptions,
  pointDistanceOptions,
} from './formOptions'
import { getSelectedStep, normalizeValue } from './formUtils'
import InputNumber from '@/ui-kit/InputNumber'

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

function ShapeSettingsForm(props: ShapeSettingsFormProps) {
  const [form] = Form.useForm()
  const [curlingOptions, setcurlingOptions] = useState<Option[]>([])
  const [spiknessOptions, setSpiknessOptions] = useState<Option[]>([])
  const lapsValues = useRef<number[]>([])

  function recalculateSpiknessOptions(laps: string | number) {
    if (laps === null) return
    setSpiknessOptions(
      pointDistanceBaseOptions.map((option, index) => ({
        ...option,
        icon: pointDistanceOptions[Number(laps)][index],
      })),
    )
  }

  function recalculateCurlingOptions(petals: string | number | null) {
    if (petals === null) return
    const values = selectEvenlySpacedValues(
      nonCommonDivisors(Number(petals)),
      6,
    )
    lapsValues.current = values
    const options: Option[] = []
    for (let i = 0; i < values.length; i++) {
      const normalizedValue = normalizeValue(i, values.length, 6)
      options.push({
        label: lapsOptions[normalizedValue].label,
        value: normalizedValue,
        icon: lapsOptions[normalizedValue].icon,
      })
    }
    const prevValue = form.getFieldValue('laps')
    const newValue = curlingOptions.length
      ? normalizeValue(
          normalizeValue(prevValue, 6, values.length),
          values.length,
          6,
        )
      : 1
    if (curlingOptions.length !== options.length) {
      form.setFieldsValue({
        laps: newValue,
      })
    }
    setcurlingOptions(options)
    recalculateSpiknessOptions(newValue)
  }

  function handleFinish(values: ShapeSettingsFormStore) {
    props.onEdit({
      ...values,
      laps: lapsValues.current[
        normalizeValue(values.laps, 6, lapsValues.current.length)
      ],
      stepPerLap: getSelectedStep(values),
    })
  }

  function randomizeSpiro() {
    const petals = Math.floor(Math.random() * 98) + 3
    const pointDistancePercentage = Math.floor(Math.random() * 5) * 20 + 10
    const laps = Math.floor(Math.random() * 6)
    const stepPerLap = Math.floor(Math.random() * 3)
    form.setFieldsValue({
      petals: petals,
      laps: laps,
      pointDistancePercentage: pointDistancePercentage,
      stepPerLap: stepPerLap,
    })
    recalculateCurlingOptions(petals)
    form.submit()
  }

  useEffect(() => {
    form.setFieldsValue({
      petals: props.spiro.petals,
      pointDistancePercentage: props.spiro.pointDistancePercentage,
    })
    recalculateCurlingOptions(props.spiro.petals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, props.spiro.petals, props.spiro.pointDistancePercentage])

  return (
    <div className="flex flex-col">
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{ type: 'Hypocycloid', laps: 3, stepPerLap: 1 }}
      >
        <Form.Item label="Curve type" name="type">
          <Select disabled>
            <Select.Option value="Hypocycloid">Hypocycloid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Petals amount" name="petals">
          <InputNumber min={3} max={100} onChange={recalculateCurlingOptions} />
        </Form.Item>
        <Form.Item label="Petals curling" name="laps">
          <OptionPicker
            options={curlingOptions}
            onChange={recalculateSpiknessOptions}
          />
        </Form.Item>
        <Form.Item
          label="Spikiness" // translate: "Puntiagudez" antonimo: "redondez" o "curvatura"
          name="pointDistancePercentage"
        >
          <OptionPicker options={spiknessOptions} />
        </Form.Item>
        <Form.Item
          label="Detail:"
          name="stepPerLap"
          tooltip="Amount of points per lap"
        >
          <OptionPicker options={detailOptions} />
        </Form.Item>
        <Button icon={<Icon path={mdiAutoFix} />} onClick={randomizeSpiro}>
          I feel lucky
        </Button>
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
