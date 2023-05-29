import ListFavoriteSpiros from "./components/ListFavoriteSpiros";
import SpiroCanvas from "./components/SpiroCanvas";
import SpiroForm from "./components/SpiroForm";
import { Button, Col, Row } from "antd";

const colSpan = 8;

function App() {
  const params = [
    {
      movingRadius: 504,
      pointDistance: 1512,
    }, {
      movingRadius: 420,
      pointDistance: 840,
    }, {
      movingRadius: 630,
      pointDistance: 630,
    }
  ]

  return (
    <>
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <div className="flex flex-col gap-16">
          <h1>Spirograph 2.0</h1>
          <div className="flex gap-16 justify-between">
            <Button>Change Language</Button>
            <Button>Show advance Settings</Button>
          </div>
          <SpiroForm />
        </div>
      </Col>
      <Col span={16}>
        <SpiroCanvas
          movingRadius={params[0].movingRadius}
          pointDistance={params[0].pointDistance}
          interpolation="derivative"
          msPerStep={20}
          step={44}
        />
      </Col>
      <Col span={24}>
        <ListFavoriteSpiros />
      </Col>
    </Row>
    
    </>
  );
}

export default App;
