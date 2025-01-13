import { mdiDownloadBoxOutline, mdiHeartPlusOutline, mdiGesture } from '@mdi/js'
import styled from 'styled-components'
import { SpiroAnimationSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import Button from '@/ui-kit/Button'
import { useFavSpiros } from '@/contexts/favSpiros'
import { SpiroCanvasHandle } from '../SpiroCanvas'
import EditableInput from '@/ui-kit/EditableInput'
import { Dropdown, Space } from 'antd'
import { animationSpeedOptions } from './formOptions'
import { useMemo, useState } from 'react'

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
  const [ selectedVel, setSelectedVel ] = useState(0)

  const selectedIcon = useMemo(() => {
    return animationSpeedOptions.find(option => option.value === selectedVel)?.icon || ''
  }, [selectedVel])
  // const items = useMemo(() => {
  //   return animationSpeedOptions.map(option => (
  //     {
  //       key: option.label,
  //       label: option.label,
  //       icon: option.icon,
  //       onClick: () => {
  //         setSelectedVel(option.value)
  //         props.onEdit({ msPerPetal: option.value })
  //       },
  //     }
  //   ))
  // }, [props.selectedVel])

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

  return (
    <Container>
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
      <Space.Compact block>
        <Dropdown
          placement="bottomRight"
          menu={{
            items: animationSpeedOptions.map(option => (
              {
                key: option.label,
                label: option.label,
                icon: <Icon path={option.icon} />,
                onClick: () => handleChangeVel(option.value),
              })),
          }}
        >
          <Button icon={<Icon path={selectedIcon} />} />
        </Dropdown>
        <Button
          icon={<Icon path={mdiGesture} />}
          type="primary"
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
