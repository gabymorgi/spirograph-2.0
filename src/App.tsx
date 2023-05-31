import { Header } from "antd/es/layout/layout";
import ListFavoriteSpiros from "./components/favoriteSpiro/ListFavoriteSpiros";
import { Button } from "antd";
import EditingSpiro from "./components/EditingSpiro/EditingSpiro";
import { mdiTranslate, mdiTune, mdiViewAgendaOutline } from "@mdi/js";
import Icon from "./ui-kit/Icon";
import { useState } from "react";

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
            icon={
              <Icon
                path={mdiTranslate}
                title={`Change to ${language === "en" ? "Spanish" : "English"}`}
              />
            }
          >
            {language === "en" ? "Español" : "English"}
          </Button>
          <Button
            onClick={toggleShowAdvanceSettings}
            icon={
              <Icon
                path={showAdvanceSettings ? mdiViewAgendaOutline : mdiTune}
                title={`Show ${
                  showAdvanceSettings ? "friendly" : "advance"
                } Settings`}
              />
            }
          >
            Show {showAdvanceSettings ? "friendly" : "advance"} settings
          </Button>
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
