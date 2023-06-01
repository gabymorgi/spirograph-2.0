import { Button, Input, InputRef, Popconfirm } from "antd";
import Icon from "@mdi/react";
import { mdiTrashCanOutline, mdiImageEdit, mdiPencil, mdiDownloadBoxOutline, mdiExport } from "@mdi/js";
import { useRef, memo } from "react";
import styled from "styled-components";
import { useFavSpiros } from "@/contexts/favSpiros";

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
`;

interface InteractionFormProps {
  id: number;
  name: string;
}

function InteractionForm(props: InteractionFormProps) {
  const { editSpiroName, removeSpiro } = useFavSpiros()
  const inputRef = useRef<InputRef>(null);

  function handleEdit() {
    if (
      inputRef.current?.input?.value &&
      inputRef.current?.input?.value !== props.name
    ) {
      editSpiroName(props.id, inputRef.current.input.value);
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
        icon={<Icon path={mdiDownloadBoxOutline} title="Download Spiro" size={1} />}
      />
      <Button
        type="primary"
        icon={<Icon path={mdiExport} title="Export Spiro" size={1} />}
      />
      <StyledInput
        ref={inputRef}
        type="text"
        placeholder="Name"
        defaultValue={props.name}
        addonAfter={
          <div onClick={handleEdit} className="cursor-pointer">
            <Icon path={mdiPencil} title="Edit Spiro" size="15px" />
          </div>
        }
        onBlur={handleEdit}
      />
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
  );
}

export default memo(InteractionForm);
