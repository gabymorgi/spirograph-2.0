import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider, theme } from 'antd'
import { LocalStorageProvider } from './contexts/localStorage.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <LocalStorageProvider keyName="favoriteSpiros">
      <App />
    </LocalStorageProvider>
  </ConfigProvider>,
)
