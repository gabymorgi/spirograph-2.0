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
import { getMagicNumbers } from './routes/spirograph/test/sizes'
import LineChart from './routes/spirograph/test/components/LineChart'

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

  const res = Array.from({ length: 120 }, (_, i) => i + 1).map((r) => getMagicNumbers(r))
  // const res = getRes(5, 1)
  res.sort((a, b) => a.r - b.r)

  const bPoints = res.map(({ r, b }) => ({ x: r, y: b }))
  const mPoints = res.map(({ r, m }) => ({ x: r, y: m * 100 }))

  // maximum: 63.53805472008254 - 33.245605709583764

  const amount = 240
  const step = 4
  const evaluatedPoints = Array.from({ length: amount }, (_, i) => (i * step) - (amount * step) / 2).map((r) => {
    const y = getMagicNumbers(r).b
    return {
      x: r,
      y: y > 0 ? Math.log10(y) : -Math.log10(-y)
    }
  })

  
  const error = evaluatedPoints.map(({ x, y }) => {
    const real = getMagicNumbers(x).b
    return {
      x: x,
      y: Math.abs(y - real)
    }
  })

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
          <Route path="/spirograph" element={<div />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout.Content>
      <div style={{ position: 'relative' }}>
        <LineChart
          datasets={[
            {
              name: 'b',
              points: bPoints,
            },
            {
              name: 'm',
              points: mPoints,
            },
          ]}
        />
        <LineChart
          datasets={[
            {
              name: 'Error',
              points: error,
            }
          ]}
        />
      </div>
    </>
  )
}

export default App
