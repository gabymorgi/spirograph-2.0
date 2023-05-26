import Konva from "konva";
import { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Shape } from "react-konva";
import SpiroForm from "./components/SpiroForm";
import SpiroSVG from "./components/SpiroSVG";
import { Col, Row } from "antd";

function App() {
  const lineRef = useRef<Konva.Line>(null);
  const initialPoints = [20, 20, 100, 100, 150, 50];
  let animPoints = [20, 20];

  useEffect(() => {
    const anim = new Konva.Animation((frame) => {
      const time = frame?.time || 0;
      const velocity = 0.0001;
      if (animPoints.length + 1 < initialPoints.length) {
        animPoints = [...animPoints, initialPoints[animPoints.length] + velocity * time];
        console.log(animPoints);
        lineRef.current?.points(animPoints);
      } else {
        anim.stop();
      }
    }, lineRef.current?.getLayer());

    anim.start();

    return () => {
      anim.stop();
    }
  }, []);

  return (
    <>
    <SpiroForm />
    <Row>
      <Col span={24}>
        <SpiroSVG a={5} r={1} d={3} interpolation="cuadratic" />
      </Col>
      <Col span={24}>
        <SpiroSVG a={6} r={1} d={2} interpolation="cuadratic" />
      </Col>
      <Col span={24}>
        <SpiroSVG a={4} r={1} d={1} interpolation="linear" />
      </Col>
      <Col span={24}>
        <SpiroSVG a={5} r={1} d={3} interpolation="linear" />
      </Col>
      <Col span={24}>
        <SpiroSVG a={6} r={1} d={2} interpolation="linear" />
      </Col>
      <Col span={24}>
        <SpiroSVG a={4} r={1} d={1} interpolation="cuadratic" />
      </Col>
    </Row>
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Line ref={lineRef} points={animPoints} stroke="white" />
      </Layer>
      {/* <Layer>
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
      </Layer> */}
    </Stage>
    </>
  );
}

export default App;
