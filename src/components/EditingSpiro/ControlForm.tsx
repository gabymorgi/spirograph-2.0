import { Input, InputRef } from "antd";
import { mdiPencil, mdiDownloadBoxOutline, mdiRestart, mdiStretchToPageOutline, mdiContentSave } from "@mdi/js";
import { useRef } from "react";
import styled from "styled-components";
import { SpiroAnimationSettings, SpiroSettings } from "@/utils/types";
import Icon from "@/ui-kit/Icon";
import Button from "@/ui-kit/Button";
import { useLocalStorage } from "@/contexts/localStorage";

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

interface ControlFormStore {
  name: string;
}

interface ControlFormProps {
  spiro: SpiroAnimationSettings;
  onEdit: (partialSpiro: ControlFormStore) => void;
}

function ControlForm(props: ControlFormProps) {
  const { addValue } = useLocalStorage()
  const inputRef = useRef<InputRef>(null);

  function handleEdit() {
    if (
      inputRef.current?.input?.value &&
      inputRef.current?.input?.value !== props.spiro.name
    ) {
      props.onEdit({ name: inputRef.current.input.value });
    }
  }

  function handleSave() {
    const { msPerStep, ...favSpiro } = props.spiro
    addValue(favSpiro)
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
        icon={<Icon path={mdiDownloadBoxOutline} />}
      />
      <StyledInput
        ref={inputRef}
        type="text"
        placeholder="Name"
        defaultValue={props.spiro.id}
        addonAfter={
          <div onClick={handleEdit} className="cursor-pointer font-10">
            <Icon path={mdiPencil} />
          </div>
        }
        onBlur={handleEdit}
      />
      <Button
        tooltip="Redibujar"
        icon={<Icon path={mdiRestart} />}
      />
      <Button
        tooltip="Ajustar al marco"
        icon={<Icon path={mdiStretchToPageOutline} />}
      />
    </Container>
  );
}

export default ControlForm;
