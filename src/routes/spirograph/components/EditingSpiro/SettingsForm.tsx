import { Button, ColorPicker, Form, Select } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix } from '@mdi/js'
import { useMemo } from 'react'
import OptionPicker, { Option } from '@/ui-kit/OptionPicker'
import { selectEvenlySpacedValues, nonCommonDivisors } from '@/utils/maths'
import {
  lapsOptions,
  distanceBaseOptions,
  distanceOptions,
  thicknessOptions,
} from './formOptions'
import { normalizeValue } from './formUtils'
import InputNumber from '@/ui-kit/InputNumber'

interface SettingsFormStore {
  laps: number
  petals: number
  distance: number
  color: string
  strokeWidth: number
  msPerPetal: number
}

interface SettingsFormProps {
  spiro: SpiroSettings
  onEdit: (partialSpiro: Partial<SettingsFormStore>) => void
}

function SettingsForm(props: SettingsFormProps) {
  const [form] = Form.useForm()
  
  const spiknessOptions: Option[] = useMemo(() => {
    if (props.spiro.laps === null) return []
    return distanceBaseOptions.map((option, index) => ({
      ...option,
      icon: distanceOptions[0][index],
    }))
  }, [props.spiro.laps])
  
  const curlingOptions: Option[] = useMemo(() => {
    const options: Option[] = []
    const values = selectEvenlySpacedValues(
      nonCommonDivisors(props.spiro.petals),
      6,
    )
    for (let i = 0; i < values.length; i++) {
      const normalizedValue = normalizeValue(i, values.length, 6)
      options.push({
        label: lapsOptions[normalizedValue].label,
        value: values[i],
        icon: lapsOptions[normalizedValue].icon,
      })
    }
    return options
  }, [props.spiro.petals])

  function handleChangePetals(petals: string | number | null) {
    if (petals === null) return
    petals = Number(petals)
    const values = selectEvenlySpacedValues(
      nonCommonDivisors(petals),
      6,
    )
    const prevRatio = form.getFieldValue('laps') / props.spiro.petals
    const newIndex = values.findIndex((value) => value / petals > prevRatio)
    const newValue = newIndex > -1 ? values[newIndex] : values[values.length - 1]

    form.setFieldValue('laps', newValue)
    props.onEdit({
      petals,
      laps: newValue,
    })
  }

  function randomizeSpiro() {
    const petals = Math.floor(Math.random() * 98) + 3
    const distance = Math.floor(Math.random() * 5) * 20 + 10
    const laps = Math.floor(Math.random() * 6)
    form.setFieldsValue({ petals, laps, distance })
    // handleChangePetals(petals)
    form.submit()
  }

  console.log(form.getFieldsValue())

  return (
    <div className="flex flex-col">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: 'Hypocycloid', ...props.spiro }}
      >
        <Form.Item label="Curve type" name="type">
          <Select disabled>
            <Select.Option value="Hypocycloid">Hypocycloid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Petals amount" name="petals">
          <InputNumber min={3} max={100} onChange={handleChangePetals} />
        </Form.Item>
        <Form.Item label="Petals curling" name="laps">
          <OptionPicker
            options={curlingOptions}
            onChange={(laps) => props.onEdit({ laps })}
          />
        </Form.Item>
        <Form.Item
          label="Spikiness" // translate: "Puntiagudez" antonimo: "redondez" o "curvatura"
          name="distance"
        >
          <OptionPicker options={spiknessOptions} onChange={(distance) => props.onEdit({ distance })} />
        </Form.Item>
        <div className="flex gap-16">
          <Form.Item label="Line:" name="color">
            <ColorPicker
              onChange={(_value, hex) => props.onEdit({ color: hex })}
            />
          </Form.Item>
          <Form.Item label="thickness:" name="strokeWidth">
            <OptionPicker
              options={thicknessOptions}
              onChange={(value) =>
                props.onEdit({ strokeWidth: value })
              }
            />
          </Form.Item>
        </div>
        <Button icon={<Icon path={mdiAutoFix} />} onClick={randomizeSpiro} color="default" variant="outlined">
          I feel lucky
        </Button>
      </Form>
    </div>
  )
}

export default SettingsForm
