import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider, theme } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <App />
  </ConfigProvider>,
)
