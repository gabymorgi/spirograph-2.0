import { Button, Form, Input, InputRef } from "antd";
import { SpiroSettings } from "../../utils/types";
import SpiroCanvas from "../SpiroCanvas";
import Icon from "@mdi/react";
import { mdiTrashCanOutline, mdiImageEdit, mdiPencil } from "@mdi/js";
import { useRef } from "react";

interface VisualSettingsFormProps {
  id: string;
  spiro: SpiroSettings;
  onEditId: (prevId: string, newId: string) => void;
}

function VisualSettingsForm(props: VisualSettingsFormProps) {
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
    <div className="flex flex-col">
      <div className="flex">
        <Button
          type="primary"
          icon={<Icon path={mdiImageEdit} title="Edit Spiro" size={1} />}
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Name"
          defaultValue={props.id}
          addonAfter={
            <div onClick={handleEdit} className="cursor-pointer">
              <Icon path={mdiPencil} title="Edit Spiro" size={1} />
            </div>
          }
          onBlur={handleEdit}
        />
        <Button
          danger
          icon={
            <Icon
              path={mdiTrashCanOutline}
              title="Edit Spiro"
              size={1}
            />
          }
        />
      </div>
      <SpiroCanvas
        {...props.spiro}
      />
    </div>
  );
}

export default VisualSettingsForm;
