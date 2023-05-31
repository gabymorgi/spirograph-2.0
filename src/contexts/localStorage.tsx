import { getIncrementalId } from '@/utils/constants';
import { SpiroSettings } from '@/utils/types';
import { message } from 'antd';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ILocalStorageContext = {
  values: SpiroSettings[],
  setValues: React.Dispatch<React.SetStateAction<SpiroSettings[]>>,
  addValue: (value: SpiroSettings) => void,
  editValue: (id: number, value: SpiroSettings) => void,
  removeValue: (id: number) => void,
};

// Crear el contexto
const LocalStorageContext = createContext<ILocalStorageContext | undefined>(undefined);

// Crear el proveedor del contexto
function LocalStorageProvider({ children, keyName }: { children: ReactNode, keyName: string }) {
  const [values, setValues] = useState<SpiroSettings[]>(() => {
    const storedValue = localStorage.getItem(keyName);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return [];
  });

  useEffect(() => {
    if (values && keyName) {
      localStorage.setItem(keyName, JSON.stringify(values));
    }
  }, [keyName, values]);

  function addValue(value: SpiroSettings) {
    let exists = false
    // if already exists, replace it, else add it
    const newValues = values.map((v) => {
      if (v.id === value.id) {
        exists = true
        return value
      }
      return v
    })
    if (!exists) {
      // add to start
      newValues.unshift({
        ...value,
        id: getIncrementalId(),
      })
    }
    setValues(newValues);
  }

  function editValue(id: number, value: SpiroSettings) {
    const newValues = values.map((v) => {
      if (v.id === id) {
        return value;
      }
      return v;
    });
    setValues(newValues);
  }

  function removeValue(id: number) {
    const newValues = values.filter((v) => v.id !== id);
    setValues(newValues);
  }

  return (
    <LocalStorageContext.Provider value={{
      values,
      setValues,
      addValue,
      editValue,
      removeValue,
    }}>
      {children}
    </LocalStorageContext.Provider>
  );
}

// Crear un hook para utilizar el contexto
function useLocalStorage(): ILocalStorageContext {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
}

export { LocalStorageProvider, useLocalStorage };