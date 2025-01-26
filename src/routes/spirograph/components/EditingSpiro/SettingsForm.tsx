import { Button, ColorPicker, Form, Select } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix } from '@mdi/js'
import { useMemo, useRef } from 'react'
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
import styled from 'styled-components'

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

const StyledWrapper = styled.div`
  min-width: 232px;
`

function SettingsForm(props: SettingsFormProps) {
  const [form] = Form.useForm()
  const previousCurlingRel = useRef<number>(props.spiro.laps / props.spiro.petals)
  
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

  function handleChangeLaps(laps: number) {
    previousCurlingRel.current = laps / props.spiro.petals
    props.onEdit({ laps })
  }

  function handleChangePetals(petals: string | number | null) {
    if (petals === null) return
    petals = Number(petals)
    const values = selectEvenlySpacedValues(
      nonCommonDivisors(petals),
      6,
    )
    let newIndex = 0
    let diff = 1
    for (let i = 0; i < values.length; i++) {
      const newDiff = Math.abs(values[i] / petals - previousCurlingRel.current)
      if (newDiff < diff) {
        diff = newDiff
        newIndex = i
      } else {
        break
      }
    }
    const newValue = values[newIndex]

    form.setFieldValue('laps', newValue)
    props.onEdit({
      petals,
      laps: newValue,
    })
  }

  function randomizeSpiro() {
    const petals = Math.floor(Math.random() * 12) + 3
    const options = nonCommonDivisors(petals)
    const laps = options[Math.floor(Math.random() * options.length)]
    const distance = (Math.floor(Math.random() * 5) * 20 + 10) / 100
    form.setFieldsValue({ petals, laps, distance })
    props.onEdit({ petals, laps, distance })
  }

  return (
    <StyledWrapper className="flex flex-col">
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
          <InputNumber min={3} max={50} onChange={handleChangePetals} />
        </Form.Item>
        <Form.Item label="Petals curling" name="laps">
          <OptionPicker
            options={curlingOptions}
            onChange={handleChangeLaps}
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
              onChangeComplete={(value) => props.onEdit({ color: value.toHexString() })}
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
    </StyledWrapper>
  )
}

export default SettingsForm
