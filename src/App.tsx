import { Header } from 'antd/es/layout/layout'
import { Layout, Menu } from 'antd'
import { mdiTranslate, mdiTune, mdiViewAgendaOutline } from '@mdi/js'
import Icon from './ui-kit/Icon'
import { useMemo, useState } from 'react'
import Button from './ui-kit/Button'
import ReverseButton from './ui-kit/ReverseButton'
import { useThemeContext } from './contexts/ThemeContext'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Fractal from './routes/fractal/Fractal'
import Spirograph from './routes/spirograph/Spirograph'

function App() {
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const { advanced, toggleAdvanced } = useThemeContext()
  const location = useLocation()

  function toggleLanguage() {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  const title = useMemo(() => {
    switch (location.pathname) {
      case '/spirograph':
        return 'Spirograph 2.0'
      case '/fractal':
        return 'Fractal'
      default:
        return 'emoji eyes 🤪'
    }
  }, [location.pathname])

  return (
    <>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={[
          {
            key: '/spirograph',
            label: <Link to="/spirograph">spirograph</Link>,
          },
          {
            key: '/fractal',
            label: <Link to="/fractal">fractal</Link>,
          },
        ]}
      />
      <Header className="flex justify-between items-center">
        <h1 className="text-white">{title}</h1>
        <div className="flex gap-16 justify-between">
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
      <Layout.Content className="p-middle">
        <Routes>
          <Route path="/" element={<Navigate to="/spirograph" />} />
          <Route path="/fractal" element={<Fractal />} />
          <Route path="/spirograph" element={<Spirograph />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout.Content>
    </>
  )
}

export default App
