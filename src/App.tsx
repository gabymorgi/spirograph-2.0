import { Header } from 'antd/es/layout/layout'
import { Layout, Menu } from 'antd'
import { mdiTranslate, mdiTune, mdiViewAgendaOutline } from '@mdi/js'
import Icon from './ui-kit/Icon'
import { useState } from 'react'
import Button from './ui-kit/Button'
import ReverseButton from './ui-kit/ReverseButton'
import { useThemeContext } from './contexts/ThemeContext'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router'
import Fractal from './routes/fractal/Fractal'
import Spirograph from './routes/spirograph/Spirograph'

function App() {
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const { advanced, toggleAdvanced } = useThemeContext()
  const location = useLocation()

  function toggleLanguage() {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  return (
    <Layout>
      <Header className="flex justify-between items-center p-16">
        <Menu
          className="flex-grow transparent"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/spiro',
              label: <Link to="/spiro">spirograph</Link>,
            },
            {
              key: '/fractal',
              label: <Link to="/fractal">fractal</Link>,
            },
          ]}
        />
        <div className="flex gap-16">
          <Button
            onClick={toggleLanguage}
            tooltip={`Change to ${language === 'en' ? 'Spanish' : 'English'}`}
            icon={<Icon path={mdiTranslate} />}
          >
            {language === 'en' ? 'Español' : 'English'}
          </Button>
          <ReverseButton
            type="primary"
            onClick={toggleAdvanced}
            icon={<Icon path={advanced ? mdiViewAgendaOutline : mdiTune} />}
          >
            Show {advanced ? 'friendly' : 'advance'} settings
          </ReverseButton>
        </div>
      </Header>
      {/* <SpiroAnim /> */}
      {/* <Comparator /> */}
      <Layout.Content className="p-middle">
        <Routes>
          <Route path="/" element={<Navigate to="/spiro" />} />
          <Route path="/fractal" element={<Fractal />} />
          <Route path="/spiro" element={<Spirograph />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout.Content>
    </Layout>
  )
}

export default App
