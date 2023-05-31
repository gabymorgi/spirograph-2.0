import { Button, Form, InputNumber, Select } from "antd";
import { SpiroAnimationSettings, SpiroSettings } from "@/utils/types";
import {
  mdiCircle,
  mdiCircleMedium,
  mdiCircleSmall,
  mdiHorseVariant,
  mdiRabbit,
  mdiSnail,
  mdiUnicorn,
  mdiVectorBezier,
  mdiVectorCurve,
  mdiVectorLine,
  mdiVectorPolygon,
  mdiVectorSquare,
  mdiVectorTriangle,
} from "@mdi/js";
import OptionPicker from "@/ui-kit/OptionPicker";

const thicknessOptions = [
  { label: "thin", value: 10, icon: mdiCircleSmall },
  { label: "medium", value: 20, icon: mdiCircleMedium },
  { label: "thick", value: 50, icon: mdiCircle },
];

const detailOptions = [
  { label: "low", value: 10, icon: mdiVectorTriangle },
  { label: "medium", value: 20, icon: mdiVectorSquare },
  { label: "high", value: 50, icon: mdiVectorPolygon },
];

const transitionOptions = [
  { label: "linear", value: 10, icon: mdiVectorLine },
  { label: "bezier", value: 20, icon: mdiVectorCurve },
  { label: "derivative", value: 50, icon: mdiVectorBezier },
];

const animationSpeedOptions = [
  { label: "slow", value: 100, icon: mdiSnail },
  { label: "medium", value: 50, icon: mdiRabbit },
  { label: "fast", value: 20, icon: mdiHorseVariant },
  { label: "instant", value: 0, icon: mdiUnicorn },
];

interface VisualSettingsFormStore {
  id: string;
}

interface VisualSettingsFormProps {
  id: string;
  spiro: SpiroAnimationSettings;
  onEditId: (id: string, partialSpiro: VisualSettingsFormStore) => void;
}

function VisualSettingsForm(props: VisualSettingsFormProps) {
  function handleFinish(values: VisualSettingsFormStore) {
    console.log("finish", values);
  }

  return (
    <div className="flex flex-col">
      <Form layout="vertical">
        Color Picker
        <Form.Item
          label="Grosor:"
          name="strokeWidth"
          initialValue={props.spiro.strokeWidth}
          tooltip="Grosor de la línea"
        >
          <OptionPicker options={thicknessOptions} />
        </Form.Item>
        <Form.Item
          label="Detail:"
          name="stepPerLap"
          initialValue={props.spiro.stepPerLap}
          tooltip="Cantidad de puntos que se dibujan"
        >
          <OptionPicker options={detailOptions} />
        </Form.Item>
        <Form.Item
          label="Transition:"
          name="interpolation"
          initialValue={props.spiro.interpolation}
          tooltip="Tipo de interpolación entre puntos"
        >
          <OptionPicker options={transitionOptions} />
        </Form.Item>
        <Form.Item
          label="Animation speed:"
          name="msPerStep"
          initialValue={props.spiro.msPerStep}
          tooltip="Velocidad de la animación"
        >
          <OptionPicker options={animationSpeedOptions} />
        </Form.Item>
      </Form>
    </div>
  );
}

export default VisualSettingsForm;
