import { Button, Input, InputRef } from "antd";
import Icon from "@mdi/react";
import { mdiTrashCanOutline, mdiImageEdit, mdiPencil, mdiDownloadBoxOutline, mdiExport } from "@mdi/js";
import { useRef } from "react";
import styled from "styled-components";

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
  id: string;
  onEditId: (prevId: string, newId: string) => void;
}

function InteractionForm(props: InteractionFormProps) {
  const inputRef = useRef<InputRef>(null);

  function handleEdit() {
    if (
      inputRef.current?.input?.value &&
      inputRef.current?.input?.value !== props.id
    ) {
      props.onEditId(props.id, inputRef.current.input.value);
    }
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
        defaultValue={props.id}
        addonAfter={
          <div onClick={handleEdit} className="cursor-pointer">
            <Icon path={mdiPencil} title="Edit Spiro" size="15px" />
          </div>
        }
        onBlur={handleEdit}
      />
      <Button
        danger
        icon={<Icon path={mdiTrashCanOutline} title="Edit Spiro" size={1} />}
      />
    </Container>
  );
}

export default InteractionForm;
