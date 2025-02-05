import { InputRef, Popconfirm } from 'antd'
import Icon from '@mdi/react'
import {
  mdiTrashCanOutline,
  mdiImageEdit,
  mdiDownloadBoxOutline,
} from '@mdi/js'
import { useRef, memo } from 'react'
import styled from 'styled-components'
import { useFavSpiros } from '@/contexts/favSpiros'
import EditableInput from '@/ui-kit/EditableInput'
import Button from '@/ui-kit/Button'

const Container = styled.div`
  display: flex;
  > button {
    flex-shrink: 0;
  }
`

interface InteractionFormProps {
  id: number
  name: string
  onSendToEditor?: () => void
}

function InteractionForm(props: InteractionFormProps) {
  const { editSpiroName, removeSpiro } = useFavSpiros()
  const inputRef = useRef<InputRef>(null)

  function handleEditName() {
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
        tooltip="Edit Spiro"
        onClick={props.onSendToEditor}
        icon={<Icon path={mdiImageEdit} title="Edit Spiro" size={1} />}
      />
      <Button
        tooltip="Download Spiro"
        icon={
          <Icon path={mdiDownloadBoxOutline} title="Download Spiro" size={1} />
        }
      />
      <EditableInput
        onChange={handleEditName}
        id={props.id}
        name={props.name}
      />
      <Popconfirm
        title="Delete spiro"
        description="Are you sure to remove this spiro from favs?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
        okType="danger"
      >
        <Button
          danger
          tooltip="Delete Spiro"
          icon={
            <Icon path={mdiTrashCanOutline} title="Delete Spiro" size={1} />
          }
        />
      </Popconfirm>
    </Container>
  )
}

export default memo(InteractionForm)
