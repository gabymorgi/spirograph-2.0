import { Button, Form, InputNumber, Select } from "antd";
import { SpiroSettings } from "@/utils/types";

interface AnimationControlFormStore {
  id: string;
}

interface AnimationControlFormProps {
  id: string;
  spiro: SpiroSettings;
  onEditId: (id: string, partialSpiro: AnimationControlFormStore) => void;
}

function AnimationControlForm(props: AnimationControlFormProps) {

  function handleFinish(values: AnimationControlFormStore) {
    console.log("finish", values);
  }

  return (
    <div className="flex flex-col">
      <Form onFinish={handleFinish}>
        <Form.Item label="Curve type" name="type">
          <Select>
            <Select.Option value="default">Hypocycloid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tamaño del disco">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="Cantidad de vueltas">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Cantidad de petalos">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Tamaño de los petalos">
          <InputNumber />
        </Form.Item>
        <Button>
          I feel lucky
        </Button>
        <Button type="primary" htmlType="submit">
          Draw it!
        </Button>
      </Form>
    </div>
  );
}

export default AnimationControlForm;
