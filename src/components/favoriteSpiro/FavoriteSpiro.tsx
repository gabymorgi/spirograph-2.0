import { SpiroSettings } from "../../utils/types";
import SpiroCanvas from "../SpiroCanvas";
import InteractionFormProps from "./InteractionForm";

interface FavoriteSpiroProps {
  id: string;
  spiro: SpiroSettings;
  onEditId: (prevId: string, newId: string) => void;
}

function FavoriteSpiro(props: FavoriteSpiroProps) {
  return (
    <div className="flex flex-col">
      <InteractionFormProps id={props.id} onEditId={props.onEditId} />
      <SpiroCanvas
        {...props.spiro}
      />
    </div>
  );
}

export default FavoriteSpiro;
