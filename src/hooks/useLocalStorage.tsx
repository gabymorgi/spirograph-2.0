import { useEffect, useState } from "react";

// Custom hook para manejar valores de la store con tipo generico
export function useLocalStorage<T>(key: string, initialValue?: T): [T | undefined, (newValues: T) => void] {
  const [storeState, setStoreState] = useState<T | undefined>(initialValue || undefined);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setStoreState(JSON.parse(storedValue));
    } else {
      if (initialValue) {
        localStorage.setItem(
          key,
          typeof initialValue !== "object"
            ? initialValue.toString()
            : JSON.stringify(initialValue)
        );
      }
    }
  }, [key]);

  // Función para actualizar los valores de la store
  function updateStoreValues(newValues: T) {
    localStorage.setItem(
      key,
      JSON.stringify(newValues)
    );
    setStoreState(newValues);
  }

  return [storeState, updateStoreValues];
}
