import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error('[useLocalStorage] Falha ao ler dados:', error)
      return initialValue
    }
  })

  function setValue(value: T | ((prev: T) => T)): void {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('[useLocalStorage] Falha ao salvar dados:', error)
    }
  }

  return [storedValue, setValue] as const
}

export default useLocalStorage
