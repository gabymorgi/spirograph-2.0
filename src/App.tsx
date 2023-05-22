import { Stage, Layer, Rect, Text, Circle, Line, Shape } from "react-konva";

function App() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Some text on canvas" fontSize={15} />
        <Rect
          x={20}
          y={50}
          width={100}
          height={100}
          fill="red"
          shadowBlur={10}
        />
        <Circle x={200} y={100} radius={50} fill="green" />
        <Line
          x={20}
          y={200}
          points={[0, 0, 100, 0, 100, 100]}
          tension={0.5}
          closed
          stroke="white"
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 100, y: 100 }}
          fillLinearGradientColorStops={[0, "blue", 0.5, "red", 1, "yellow"]}
        />
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(100, 200);
            context.lineTo(300, 230);
            context.quadraticCurveTo(250, 200, 260, 170);
            context.closePath();
            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
          }}
          fill="#00D2FF"
          stroke="black"
          strokeWidth={4}
        />
      </Layer>
    </Stage>
  );
}

export default App;
