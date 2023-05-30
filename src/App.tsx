import { Header } from "antd/es/layout/layout";
import ListFavoriteSpiros from "./components/favoriteSpiro/ListFavoriteSpiros";
import { Button } from "antd";
import EditingSpiro from "./components/EditingSpiro/EditingSpiro";

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
      <Header className="flex justify-between items-center">
        <h1 className="text-4xl text-white">Spirograph 2.0</h1>
        <div className="flex gap-16 justify-between">
          <Button>Change Language</Button>
          <Button>Show advance Settings</Button>
        </div>
      </Header>
      <div className="flex flex-col p-16">
        <EditingSpiro />
        <ListFavoriteSpiros />
      </div>
    </>
  );
}

export default App;
