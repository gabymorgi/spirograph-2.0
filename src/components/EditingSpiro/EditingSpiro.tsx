import { Button, Col, Form, Input, InputRef, Row } from "antd";
import SpiroCanvas from "../SpiroCanvas";
import Icon from "@mdi/react";
import { mdiTrashCanOutline, mdiImageEdit, mdiPencil } from "@mdi/js";
import { useState } from "react";
import { SpiroAnimationSettings, SpiroSettings } from "@/utils/types";
import AnimationControlForm from "./AnimationControlForm";
import ShapeSettingsForm from "./ShapeSettingsForm";
import VisualSettingsForm from "./VisualSettingsForm";

const initialSpiro: SpiroAnimationSettings = {
  id: "default",
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

  function handleEditId(id: string, partialSpiro: Partial<SpiroSettings>) {
    // const newSpiro = { ...spiro, id: newId };
    // setSpiro(newSpiro);
    console.log("edit id", id, partialSpiro);
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <ShapeSettingsForm
          id={spiro.id}
          spiro={spiro}
          onEditId={handleEditId}
        />
      </Col>
      <Col span={6}>
        <VisualSettingsForm
          id={spiro.id}
          spiro={spiro}
          onEditId={handleEditId}
        />
      </Col>
      <Col span={12}>
        <AnimationControlForm
          id={spiro.id}
          spiro={spiro}
          onEditId={handleEditId}
        />
        <SpiroCanvas
          {...spiro}
        />
      </Col>
    </Row>
  );
}

export default EditingSpiro;
