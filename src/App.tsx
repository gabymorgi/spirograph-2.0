import { Header } from "antd/es/layout/layout";
import ListFavoriteSpiros from "./components/favoriteSpiro/ListFavoriteSpiros";
import { Card } from "antd";
import EditingSpiro from "./components/EditingSpiro/EditingSpiro";
import { mdiTranslate, mdiTune, mdiViewAgendaOutline } from "@mdi/js";
import Icon from "./ui-kit/Icon";
import { useState } from "react";
import Button from "./ui-kit/Button";

function App() {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);

  function toggleLanguage() {
    setLanguage(language === "en" ? "es" : "en");
  }

  function toggleShowAdvanceSettings() {
    setShowAdvanceSettings(!showAdvanceSettings);
  }

  return (
    <>
      <Header className="flex justify-between items-center">
        <h1 className="text-4xl text-white">Spirograph 2.0</h1>
        <div className="flex gap-16 justify-between">
          <Button
            onClick={toggleLanguage}
            tooltip={`Change to ${language === "en" ? "Spanish" : "English"}`}
            icon={
              <Icon
                path={mdiTranslate}
              />
            }
          >
            {language === "en" ? "Español" : "English"}
          </Button>
          <Button
            onClick={toggleShowAdvanceSettings}
            tooltip={`Show ${showAdvanceSettings ? "friendly" : "advance"
              } Settings`}
            icon={
              <Icon
                path={showAdvanceSettings ? mdiViewAgendaOutline : mdiTune}
              />
            }
          >
            Show {showAdvanceSettings ? "friendly" : "advance"} settings
          </Button>
        </div>
      </Header>
      <div className="flex flex-col gap-16 p-16">
        <Card>
          <EditingSpiro />
        </Card>
        <Card>
          <ListFavoriteSpiros />
        </Card>
      </div>
    </>
  );
}

export default App;
