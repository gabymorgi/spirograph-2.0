import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FavSpirosProvider } from './contexts/favSpiros.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <ThemeProvider>
        <FavSpirosProvider>
          <App />
        </FavSpirosProvider>
      </ThemeProvider>
    </QueryParamProvider>
  </BrowserRouter>,
)
