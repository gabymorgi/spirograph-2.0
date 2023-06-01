import { SpiroSettings } from "@/utils/types";
import SpiroCanvas from "../SpiroCanvas";
import InteractionFormProps from "./InteractionForm";

interface FavoriteSpiroProps {
  spiro: SpiroSettings;
}

function FavoriteSpiro(props: FavoriteSpiroProps) {
  return (
    <div className="flex flex-col">
      <InteractionFormProps id={props.spiro.id} name={props.spiro.name} />
      <SpiroCanvas
        {...props.spiro}
      />
    </div>
  );
}

export default FavoriteSpiro;
