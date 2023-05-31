import { Button, Col, Form, Input, InputRef, Row } from "antd";
import SpiroCanvas from "../SpiroCanvas";
import Icon from "@mdi/react";
import { mdiTrashCanOutline, mdiImageEdit, mdiPencil } from "@mdi/js";
import { useState } from "react";
import { SpiroAnimationSettings, SpiroSettings } from "@/utils/types";
import AnimationControlForm from "./ControlForm";
import ShapeSettingsForm from "./ShapeSettingsForm";
import VisualSettingsForm from "./VisualSettingsForm";
import { getIncrementalId } from "@/utils/constants";

const initialSpiro: SpiroAnimationSettings = {
  id: getIncrementalId(),
  name: "My Spiro",
  movingRadius: 504,
  pointDistance: 1512,
  interpolation: "derivative",
  stepPerLap: 44,
  strokeWidth: 10,
  color: "#ffffff",
  backgroundColor: "#00000000",
  msPerStep: 20,
};

function EditingSpiro() {
  const [spiro, setSpiro] = useState<SpiroAnimationSettings>(initialSpiro)

  function handleEdit(partialSpiro: Partial<SpiroAnimationSettings>) {
    const newSpiro = { ...spiro, ...partialSpiro };
    setSpiro(newSpiro);
    console.log("edit id", partialSpiro);
  }

  return (
    <div className="flex gap-16">
      <div className="flex gap-16">
        <ShapeSettingsForm
          spiro={spiro}
          onEdit={handleEdit}
        />
        <VisualSettingsForm
          spiro={spiro}
          onEdit={handleEdit}
        />
      </div>
      <div className="flex-grow">
        <AnimationControlForm
          spiro={spiro}
          onEdit={handleEdit}
        />
        <SpiroCanvas
          {...spiro}
        />
      </div>
    </div>
  );
}

export default EditingSpiro;
