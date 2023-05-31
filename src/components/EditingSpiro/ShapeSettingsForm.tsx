import { Button, Form, InputNumber, Select } from "antd";
import { SpiroSettings } from "@/utils/types";
import Icon from "@/ui-kit/Icon";
import { mdiAutoFix, mdiGesture } from "@mdi/js";

interface ShapeSettingsFormStore {
  movingRadius: number;
  pointDistance: number;
}

interface ShapeSettingsFormProps {
  spiro: SpiroSettings;
  onEdit: (partialSpiro: ShapeSettingsFormStore) => void;
}

function ShapeSettingsForm(props: ShapeSettingsFormProps) {
  function handleFinish(values: ShapeSettingsFormStore) {
    props.onEdit({
      movingRadius: values.movingRadius,
      pointDistance: values.pointDistance,
    });
    console.log("finish", values);
  }

  return (
    <div className="flex flex-col">
      <Form onFinish={handleFinish} initialValues={props.spiro} layout="vertical">
        <Form.Item label="Curve type" name="type">
          <Select disabled>
            <Select.Option value="Hypocycloid">Hypocycloid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tamaño del disco" name="movingRadius" rules={[{
          required: true,
          message: "Please input the moving radius",
        }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Cantidad de vueltas" name="lapsAmount">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="Cantidad de petalos" name="petalsAmount">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="Tamaño de los petalos" name="pointDistance" rules={[{
          required: true,
          message: "Please input the petals size",
        }]}>
          <InputNumber />
        </Form.Item>
        <Button icon={<Icon path={mdiAutoFix} />}>
          I feel lucky
        </Button>
        <Button
          icon={<Icon path={mdiGesture} />}
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
