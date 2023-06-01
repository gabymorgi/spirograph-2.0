import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider, theme } from 'antd'
import { FavSpirosProvider } from './contexts/favSpiros.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <FavSpirosProvider keyName="favoriteSpiros">
      <App />
    </FavSpirosProvider>
  </ConfigProvider>,
)
