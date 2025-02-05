import { Button, ColorPicker, Form, Select } from 'antd'
import { SpiroSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import { mdiAutoFix } from '@mdi/js'
import { useMemo, useRef } from 'react'
import OptionPicker, { Option } from '@/ui-kit/OptionPicker'
import { selectEvenlySpacedValues, nonCommonDivisors } from '@/utils/maths'
import { distanceBaseOptions, thicknessOptions } from './formOptions'
import { normalizeValue } from './formUtils'
import InputNumber from '@/ui-kit/InputNumber'
import styled from 'styled-components'
import dAttributes from '../../icons/dAttribute.json'

const dAttr: Record<string, string> = dAttributes

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

function getCurlingRel(laps: number, petals: number) {
  return laps < petals / 2 ? laps : laps - petals
}

function SettingsForm(props: SettingsFormProps) {
  const [form] = Form.useForm()
  const previousCurlingRel = useRef<number>(
    getCurlingRel(props.spiro.laps, props.spiro.petals),
  )

  const lapsValues: number[] = useMemo(() => {
    return selectEvenlySpacedValues(nonCommonDivisors(props.spiro.petals), 6)
  }, [props.spiro.petals])

  const spiknessOptions: Option[] = useMemo(() => {
    if (props.spiro.laps === null) return []
    let index = lapsValues.indexOf(props.spiro.laps)
    if (index === -1) {
      // find closest value
      let diff = Infinity
      for (let i = 0; i < lapsValues.length; i++) {
        const newDiff = Math.abs(lapsValues[i] - props.spiro.laps)
        if (newDiff < diff) {
          diff = newDiff
          index = i
        }
      }
    }
    const normalizedValue = normalizeValue(index, lapsValues.length, 6)
    return distanceBaseOptions.map((option) => ({
      ...option,
      icon: dAttr[`d${normalizedValue}-${option.value}`],
    }))
  }, [lapsValues, props.spiro.laps])

  const curlingOptions: Option[] = useMemo(() => {
    const options: Option[] = []
    for (let i = 0; i < lapsValues.length; i++) {
      const normalizedValue = normalizeValue(i, lapsValues.length, 6)
      const key = `l${normalizedValue}-${props.spiro.distance}`
      options.push({
        value: lapsValues[i],
        icon: dAttr[key],
      })
    }
    return options
  }, [lapsValues, props.spiro.distance])

  function handleChangeLaps(laps: number) {
    previousCurlingRel.current = getCurlingRel(laps, props.spiro.petals)
    props.onEdit({ laps })
  }

  function handleChangePetals(petals: string | number | null) {
    if (petals === null) return
    petals = Number(petals)
    const values = selectEvenlySpacedValues(nonCommonDivisors(petals), 6)
    let newIndex = 0
    const isPositive = previousCurlingRel.current > 0
    const startIndex = isPositive ? 0 : values.length - 1
    const endIndex = isPositive ? values.length / 2 : values.length / 2 - 1
    const step = isPositive ? 1 : -1
    const comp = isPositive
      ? previousCurlingRel.current
      : petals + previousCurlingRel.current
    let diff = petals
    for (let i = startIndex; i !== endIndex; i += step) {
      const newDiff = Math.abs(comp - values[i])
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
        <Form.Item label="" name="type">
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
            iconProps={{ stroke: true }}
          />
        </Form.Item>
        <Form.Item
          label="Spikiness" // translate: "Puntiagudez" antonimo: "redondez" o "curvatura"
          name="distance"
        >
          <OptionPicker
            options={spiknessOptions}
            onChange={(distance) => props.onEdit({ distance })}
            iconProps={{ stroke: true }}
          />
        </Form.Item>
        <div className="flex gap-16">
          <Form.Item label="Line:" name="color">
            <ColorPicker
              onChangeComplete={(value) =>
                props.onEdit({ color: value.toHexString() })
              }
            />
          </Form.Item>
          <Form.Item label="thickness:" name="strokeWidth">
            <OptionPicker
              options={thicknessOptions}
              onChange={(value) => props.onEdit({ strokeWidth: value })}
            />
          </Form.Item>
        </div>
        <Button
          icon={<Icon path={mdiAutoFix} />}
          onClick={randomizeSpiro}
          color="default"
          variant="outlined"
        >
          I feel lucky
        </Button>
      </Form>
    </StyledWrapper>
  )
}

export default SettingsForm
