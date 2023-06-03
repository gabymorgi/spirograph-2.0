import { Button, InputRef, Popconfirm } from 'antd'
import Icon from '@mdi/react'
import {
  mdiTrashCanOutline,
  mdiImageEdit,
  mdiDownloadBoxOutline,
  mdiExport,
} from '@mdi/js'
import { useRef, memo } from 'react'
import styled from 'styled-components'
import { useFavSpiros } from '@/contexts/favSpiros'
import EditableInput from '@/ui-kit/EditableInput'

const Container = styled.div`
  display: flex;
  > button {
    flex-shrink: 0;
  }
`

interface InteractionFormProps {
  id: number
  name: string
}

function InteractionForm(props: InteractionFormProps) {
  const { editSpiroName, removeSpiro } = useFavSpiros()
  const inputRef = useRef<InputRef>(null)

  function handleEdit() {
    if (
      inputRef.current?.input?.value &&
      inputRef.current?.input?.value !== props.name
    ) {
      editSpiroName(props.id, inputRef.current.input.value)
    }
  }

  function handleDelete() {
    removeSpiro(props.id)
  }

  return (
    <Container>
      <Button
        type="primary"
        icon={<Icon path={mdiImageEdit} title="Edit Spiro" size={1} />}
      />
      <Button
        type="primary"
        icon={
          <Icon path={mdiDownloadBoxOutline} title="Download Spiro" size={1} />
        }
      />
      <Button
        type="primary"
        icon={<Icon path={mdiExport} title="Export Spiro" size={1} />}
      />
      <EditableInput onChange={handleEdit} id={props.id} name={props.name} />
      <Popconfirm
        title="Delete spiro"
        description="Are you sure to remove this spiro from favs?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button
          danger
          icon={<Icon path={mdiTrashCanOutline} title="Edit Spiro" size={1} />}
        />
      </Popconfirm>
    </Container>
  )
}

export default memo(InteractionForm)
