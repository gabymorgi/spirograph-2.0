import { mdiDownloadBoxOutline, mdiRestart, mdiHeartPlusOutline } from '@mdi/js'
import styled from 'styled-components'
import { SpiroAnimationSettings } from '@/utils/types'
import Icon from '@/ui-kit/Icon'
import Button from '@/ui-kit/Button'
import { useFavSpiros } from '@/contexts/favSpiros'
import { SpiroCanvasHandle } from '../SpiroCanvas'
import EditableInput from '@/ui-kit/EditableInput'
import { SpiroParam } from '@/utils/queryParamsUtils'
import { useQueryParams } from 'use-query-params'

const Container = styled.div`
  display: flex;
  > button {
    flex-shrink: 0;
  }
`

interface ControlFormProps {
  spiroRef: React.RefObject<SpiroCanvasHandle>
}

function ControlForm(props: ControlFormProps) {
  const [query, setQuery] = useQueryParams(SpiroParam)
  const spiro = query as SpiroAnimationSettings
  const { addSpiro } = useFavSpiros()

  function handleSave() {
    const { msPerPetal, ...favSpiro } = spiro
    addSpiro(favSpiro)
  }

  function handleReDraw() {
    props.spiroRef.current?.redraw()
  }

  function handleDownload() {
    props.spiroRef.current?.download()
  }

  function handleNameChange(name: string) {
    setQuery({ name }, 'replaceIn')
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
        id={spiro.id}
        name={spiro.name}
      />
      <Button
        type="primary"
        tooltip="Redibujar"
        onClick={handleReDraw}
        icon={<Icon path={mdiRestart} />}
      />
    </Container>
  )
}

export default ControlForm
