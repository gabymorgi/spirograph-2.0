import { Button, Form, InputNumber, Select } from "antd";
import { SpiroSettings } from "@/utils/types";
import Icon from "@/ui-kit/Icon";
import { mdiAutoFix, mdiGesture } from "@mdi/js";

interface ShapeSettingsFormStore {
  id: string;
}

interface ShapeSettingsFormProps {
  id: string;
  spiro: SpiroSettings;
  onEditId: (id: string, partialSpiro: ShapeSettingsFormStore) => void;
}

function ShapeSettingsForm(props: ShapeSettingsFormProps) {
  function handleFinish(values: ShapeSettingsFormStore) {
    console.log("finish", values);
  }

  return (
    <div className="flex flex-col">
      <Form onFinish={handleFinish} initialValues={props.spiro} layout="vertical">
        <Form.Item label="Curve type" name="type">
          <Select>
            <Select.Option value="Hypocycloid">Hypocycloid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tamaño del disco" name="movingRadius">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="Cantidad de vueltas" name="lapsAmount">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Cantidad de petalos" name="petalsAmount">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Tamaño de los petalos" name="petalSize">
          <InputNumber />
        </Form.Item>
        <Button icon={<Icon path={mdiAutoFix} title="I feel lucky" />}>
          I feel lucky
        </Button>
        <Button
          icon={<Icon path={mdiGesture} title="Draw it!" />}
          type="primary"
          htmlType="submit"
        >
          Draw it!
        </Button>
      </Form>
    </div>
  );
}

export default ShapeSettingsForm;
