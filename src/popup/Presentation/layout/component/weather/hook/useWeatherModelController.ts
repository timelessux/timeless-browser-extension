import { useEffect, useState } from 'react'
import { TWeatherAPI } from '../../../../../../../ts/types'

const ONE_HOUR = 1000 * 60 * 60

export default function useWeatherModelController() {
  const [weather, setWeather] = useState<TWeatherAPI>()
  const [loading, setLoading] = useState<boolean>(true)

  const getWeatherApi = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      chrome.runtime
        .sendMessage({
          type: 'getWeather',
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
        .then((res) => {
          if (res) {
            setWeather(res.weather)
            setLoading(false)
          }
        })
    })
  }

  useEffect(() => {
    setLoading(true)
    getWeatherApi()
    setInterval(() => getWeatherApi(), ONE_HOUR)
  }, [])

  chrome.runtime.onMessage.addListener(function ({ type, ...params }) {
    switch (type) {
      case 'weather':
        setWeather(params.weather)
        setLoading(false)
        break
      default:
        break
    }
  })

  return {
    weather,
    loading
  }
}
