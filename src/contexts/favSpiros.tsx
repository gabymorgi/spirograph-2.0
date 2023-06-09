import { SpiroSettings } from '@/utils/types'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

type IFavSpirosContext = {
  spiros: SpiroSettings[]
  setSpiros: React.Dispatch<React.SetStateAction<SpiroSettings[]>>
  addSpiro: (spiro: SpiroSettings) => void
  editSpiroName: (id: number, name: string) => void
  removeSpiro: (id: number) => void
}

// Crear el contexto
const FavSpirosContext = createContext<IFavSpirosContext | undefined>(undefined)

// Crear el proveedor del contexto
function FavSpirosProvider({ children }: { children: ReactNode }) {
  const [spiros, setSpiros] = useState<SpiroSettings[]>(() => {
    const storedSpiros = localStorage.getItem('favoriteSpiros')
    if (storedSpiros) {
      return JSON.parse(storedSpiros)
    }
    return []
  })

  useEffect(() => {
    if (spiros) {
      localStorage.setItem('favoriteSpiros', JSON.stringify(spiros))
    }
  }, [spiros])

  function addSpiro(spiro: SpiroSettings) {
    let exists = false
    // if already exists, replace it, else add it
    const newSpiros = spiros.map((v) => {
      if (v.id === spiro.id) {
        exists = true
        return spiro
      }
      return v
    })
    if (!exists) {
      // add to start
      newSpiros.unshift(spiro)
    }
    setSpiros(newSpiros)
  }

  function editSpiroName(id: number, name: string) {
    const newSpiros = spiros.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          name,
        }
      }
      return v
    })
    setSpiros(newSpiros)
  }

  function removeSpiro(id: number) {
    const newSpiros = spiros.filter((v) => v.id !== id)
    setSpiros(newSpiros)
  }

  return (
    <FavSpirosContext.Provider
      value={{
        spiros,
        setSpiros,
        addSpiro,
        editSpiroName,
        removeSpiro,
      }}
    >
      {children}
    </FavSpirosContext.Provider>
  )
}

// Crear un hook para utilizar el contexto
function useFavSpiros(): IFavSpirosContext {
  const context = useContext(FavSpirosContext)
  if (!context) {
    throw new Error('useFavSpiros must be used within a FavSpirosProvider')
  }
  return context
}

export { FavSpirosProvider, useFavSpiros }
