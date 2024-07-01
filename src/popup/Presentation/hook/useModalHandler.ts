import { useEffect, useState } from 'react'

const useModalHandler = <T>(initialState?: T) => {
  const [visible, setVisible] = useState(false)
  const [currentValue, setCurrentValue] = useState(initialState)
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined)

  const show = (data?: T, activeTab?: string) => {
    data && setCurrentValue(data)
    activeTab && setActiveTab(activeTab)
    setVisible(true)
  }

  const hide = () => {
    setVisible(false)
    setCurrentValue(undefined)
    setActiveTab(undefined)
  }

  useEffect(() => {
    setCurrentValue(initialState)
  }, [initialState])

  return {
    visible,
    activeTab,
    currentValue,
    show,
    hide
  }
}

export default useModalHandler
