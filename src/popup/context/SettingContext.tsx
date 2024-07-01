import moment from 'moment'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getData, storeTimeFormat, storeTimeZone } from '../../../utils/chromeStorage'

interface SettingContextType {
  timezone: string
  setTimezone: (e: string) => void
  currentTime: moment.Moment
  setCurrentTime: (e) => void
  militaryFormat: boolean
  setMilitaryFormat: (e: boolean) => void
}

const SettingContext = createContext<SettingContextType>(null!)

export function SettingProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState<string>('')
  const [currentTime, setCurrentTime] = useState(moment())
  const [militaryFormat, setMilitaryFormat] = useState(false)

  useEffect(() => {
    getData('timeZone').then((res) => {
      if (res) {
        setTimezone(res)
      }
    })

    getData('timeFormat').then((res) => {
      if (res && typeof res === 'boolean') {
        setMilitaryFormat(res)
      }
    })
  }, [])

  const updateTime = () => {
    if (timezone) {
      setCurrentTime(moment.tz(timezone))
    } else {
      setCurrentTime(moment())
    }
  }

  useEffect(() => {
    if (timezone) {
      setCurrentTime(moment.tz(timezone))
    }
    const interval = setInterval(updateTime, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [timezone])

  const value = {
    timezone,
    setTimezone: (value: string) => {
      storeTimeZone(value)
      setTimezone(value)
    },
    currentTime,
    setCurrentTime: (value) => {
      setCurrentTime(value)
    },
    militaryFormat,
    setMilitaryFormat: (value: boolean) => {
      storeTimeFormat(value)
      setMilitaryFormat(value)
    }
  }

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export function useSettingProvider() {
  return useContext(SettingContext)
}
