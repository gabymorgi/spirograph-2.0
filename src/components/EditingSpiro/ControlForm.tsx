import { Input, InputRef } from 'antd'
import {
  mdiPencil,
  mdiDownloadBoxOutline,
  mdiRestart,
  mdiContentSave,
} from '@mdi/js'
import { useRef } from 'react'
import styled from 'styled-components'
import { SpiroAnimationSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import Button from '@/ui-kit/Button'
import { useFavSpiros } from '@/contexts/favSpiros'
import { SpiroCanvasHandle } from '../SpiroCanvas'

const Container = styled.div`
  display: flex;
  > button {
    flex-shrink: 0;
  }
`

const StyledInput = styled(Input)`
  .ant-input:focus {
    border-right: none;
  }
  .ant-input-group-addon {
    display: none;
  }
  // .ant-input-group-addon is beside a focused input
  .ant-input:focus + .ant-input-group-addon {
    background-color: #141414;
    border-color: blue;
    display: table-cell;
  }
`

interface ControlFormStore {
  name: string
}

interface ControlFormProps {
  spiroRef: React.RefObject<SpiroCanvasHandle>
  spiro: SpiroAnimationSettings
  onEdit: (partialSpiro: ControlFormStore) => void
}

function ControlForm(props: ControlFormProps) {
  const { addSpiro } = useFavSpiros()
  const inputRef = useRef<InputRef>(null)

  function handleEdit() {
    if (
      inputRef.current?.input?.value &&
      inputRef.current?.input?.value !== props.spiro.name
    ) {
      props.onEdit({ name: inputRef.current.input.value })
    }
  }

  function handleSave() {
    const { msPerLap, ...favSpiro } = props.spiro
    addSpiro(favSpiro)
  }

  function handleReDraw() {
    props.spiroRef.current?.redraw()
  }

  function handleDownload() {
    props.spiroRef.current?.download()
  }

  return (
    <Container>
      <Button
        type="primary"
        tooltip="Save to Favs"
        onClick={handleSave}
        icon={<Icon path={mdiContentSave} />}
      />
      <Button
        tooltip="Download Spiro"
        onClick={handleDownload}
        icon={<Icon path={mdiDownloadBoxOutline} />}
      />
      <StyledInput
        ref={inputRef}
        type="text"
        placeholder="Name"
        defaultValue={props.spiro.name}
        addonAfter={
          <div onClick={handleEdit} className="cursor-pointer font-10">
            <Icon path={mdiPencil} />
          </div>
        }
        onBlur={handleEdit}
      />
      <Button
        tooltip="Redibujar"
        onClick={handleReDraw}
        icon={<Icon path={mdiRestart} />}
      />
    </Container>
  )
}

export default ControlForm
