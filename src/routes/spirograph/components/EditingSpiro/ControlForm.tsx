import { mdiDownloadBoxOutline, mdiHeartPlusOutline } from '@mdi/js'
import styled from 'styled-components'
import { SpiroAnimationSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import Button from '@/ui-kit/Button'
import { useFavSpiros } from '@/contexts/favSpiros'
import { SpiroCanvasHandle } from '../SpiroCanvas'
import EditableInput from '@/ui-kit/EditableInput'
import { Dropdown, Space } from 'antd'
import { animationSpeedOptions } from './formOptions'
import { useEffect, useMemo, useState } from 'react'
import { defaultMsPerPetal } from '@/utils/constants'

const Container = styled.div`
  display: flex;
  > button {
    flex-shrink: 0;
  }
`

interface ControlFormStore {
  name: string
}

interface ControlFormProps {
  spiroRef: React.RefObject<SpiroCanvasHandle | null>
  spiro: SpiroAnimationSettings
  onEdit: (partialSpiro: ControlFormStore) => void
}

function ControlForm(props: ControlFormProps) {
  const { addSpiro } = useFavSpiros()
  const [selectedVel, setSelectedVel] = useState(defaultMsPerPetal)

  const selectedIcon = useMemo(() => {
    return animationSpeedOptions.find(option => option.value === selectedVel)?.icon || ''
  }, [selectedVel])

  const items = useMemo(() => {
    return animationSpeedOptions.map(option => ({
      key: option.label,
      label: option.label,
      icon: <Icon path={option.icon} />,
      onClick: () => handleChangeVel(option.value),
    }))
  }, [])

  function handleSave() {
    addSpiro(props.spiro)
  }

  function handleChangeVel(vel: number) {
    setSelectedVel(vel)
    handleReDraw(vel)
  }

  function handleReDraw(vel: number) {
    props.spiroRef.current?.redraw(vel)
  }

  function handleDownload() {
    props.spiroRef.current?.download()
  }

  function handleNameChange(name: string) {
    props.onEdit({ name })
  }

  // animation effect
  useEffect(() => {
    handleReDraw(selectedVel)
  }, [])

  return (
    <Container>
      <Space.Compact block>
        <Button
          tooltip="Save to Favs"
          onClick={handleSave}
          icon={<Icon path={mdiHeartPlusOutline} />}
        />
        <Button
          tooltip="Download Spiro"
          onClick={handleDownload}
          icon={<Icon path={mdiDownloadBoxOutline} />}
        />
        <EditableInput
          onChange={handleNameChange}
          id={props.spiro.id}
          name={props.spiro.name}
        />

        <Dropdown menu={{ items }}>
          <Button color="primary" variant='outlined' icon={<Icon path={selectedIcon} />} />
        </Dropdown>
        <Button
          color="primary"
          variant='outlined'
          htmlType="submit"
          onClick={() => handleReDraw(selectedVel)}
        >
          Draw it!
        </Button>
      </Space.Compact>

    </Container>
  )
}

export default ControlForm
