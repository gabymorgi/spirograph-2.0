import { ConfigProvider, theme } from 'antd'
import { createContext, useContext, useState, ReactNode } from 'react'

type ThemeProvider = {
  advanced: boolean
  toggleAdvanced: () => void
}

// Crear el contexto
const ThemeContext = createContext<ThemeProvider | undefined>(undefined)

// Crear el proveedor del contexto
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [advanced, setAdvanced] = useState<boolean>(false)

  function toggleAdvanced() {
    setAdvanced(!advanced)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: advanced ? '#b423fc' : '#00c0c0',
        },
      }}
    >
      <ThemeContext.Provider value={{ advanced, toggleAdvanced }}>
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  )
}

// Crear un hook para utilizar el contexto
export function useThemeContext(): ThemeProvider {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
