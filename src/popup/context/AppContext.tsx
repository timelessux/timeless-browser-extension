import React, { ReactNode, createContext, useState } from 'react'
import { DailyDataDTO } from '../Data/DataSource/DashboardDataSource'
import { DashboardRepository } from '../Domain/Repository'

type TAppContext = {
  installationId?: string
  backgroundUrl?: string
  quote?: DailyDataDTO['data']['extension']['getDailyData']['quote']
  getDailyData: (
    installationId: string,
    timeZone: string
  ) => Promise<DailyDataDTO['data']['extension']['getDailyData']>
}

const rawDailyData = {
  quote: {
    createdAt: 'Fri Jan 12 2024',
    quoteId: '1',
    updatedAt: 'Fri Jan 12 2024',
    author: 'Snoop Dogg',
    content:
      'You might not have a car or a big gold chain, stay true to yourself and things will change.'
  },
  image: {
    imageId: '1',
    url: 'https://res.cloudinary.com/timeless/image/upload/v1/app/Chrome%20extension/Background/30.jpeg',
    createdAt: 'Fri Jan 12 2024',
    updatedAt: 'Fri Jan 12 2024'
  }
}

export const AppContext = createContext<TAppContext>({} as TAppContext)
type TAppProvider = { children: ReactNode }
export const AppProvider = (props: TAppProvider) => {
  const [installationId, setInstallationId] = useState<string>()
  const [dailyData, setDailyData] = useState<DailyDataDTO['data']['extension']['getDailyData']>()

  const _getDailyData = async (
    installationId: string,
    timeZone: string
  ): Promise<DailyDataDTO['data']['extension']['getDailyData']> => {
    try {
      const response = await DashboardRepository().getDailyData(installationId, timeZone)
      setDailyData(response)
      chrome.storage.sync.set({ dailyData: response })
      return response
    } catch (error) {
      // console.log('Error getDailyData', error)
      const response = await chrome.storage.sync.get('dailyData')
      setDailyData(response?.dailyData ?? rawDailyData)
      return response?.dailyData ?? rawDailyData
    }
  }

  /** Random unique ID when installed extension*/
  const getRandomToken = () => {
    const randomPool = new Uint8Array(32)
    crypto.getRandomValues(randomPool)
    let hex = ''
    for (let i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16)
    }
    return hex
  }

  chrome.storage.sync.get('installationId', (items) => {
    let installationId: string | undefined = items.installationId
    if (installationId) return setInstallationId(installationId)
    installationId = getRandomToken()
    chrome.storage.sync.set({ installationId }, () => setInstallationId(installationId))
  })
  /** Random unique ID when installed extension*/

  const value: TAppContext = {
    installationId,
    backgroundUrl: dailyData?.image.url,
    quote: dailyData?.quote,
    getDailyData: _getDailyData
  }

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
}
