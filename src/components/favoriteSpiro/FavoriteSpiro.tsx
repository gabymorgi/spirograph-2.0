import { SpirographSettings } from "../../utils/maths.type";
import SpiroCanvas from "../SpiroCanvas";
import FavoriteForm from "./FavoriteForm";

interface FavoriteSpiroProps {
  id: string;
  spiro: SpirographSettings;
  onEditId: (prevId: string, newId: string) => void;
}

function FavoriteSpiro(props: FavoriteSpiroProps) {
  return (
    <div className="flex flex-col">
      <FavoriteForm id={props.id} onEditId={props.onEditId} />
      <SpiroCanvas
        movingRadius={props.spiro.movingRadius}
        pointDistance={props.spiro.pointDistance}
        interpolation={props.spiro.interpolation}
        step={props.spiro.step}
        color={props.spiro.color}
        backgroundColor={props.spiro.backgroundColor}
        strokeWidth={props.spiro.strokeWidth || 10}
      />
    </div>
  );
}

export default FavoriteSpiro;
