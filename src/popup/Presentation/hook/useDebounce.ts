import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay?: number) => {
  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setCurrentValue(value), delay ?? 500)
    return () => clearTimeout(timer)
  }, [value])

  return currentValue
}
