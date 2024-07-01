import React from 'react'
import { BsCloudSun, BsClouds, BsCloudRain, BsCloudLightning, BsSnow } from 'react-icons/bs'
import useWeatherModelController from './hook/useWeatherModelController'
import { MdOutlineWbSunny } from 'react-icons/md'
import { AiOutlineCloud } from 'react-icons/ai'
import { LuCloudSunRain } from 'react-icons/lu'
import { RiMistFill } from 'react-icons/ri'

const Weather = () => {
  const { weather, loading } = useWeatherModelController()

  function getIconWeather(icon?: string) {
    switch (icon) {
      case '01d':
      case '01n':
        return <MdOutlineWbSunny />

      case '02d':
      case '02n':
        return <BsCloudSun />

      case '03d':
      case '03n':
        return <AiOutlineCloud />

      case '04d':
      case '04n':
        return <BsClouds />

      case '09d':
      case '09n':
        return <BsCloudRain />

      case '10d':
      case '10n':
        return <LuCloudSunRain />

      case '11d':
      case '11n':
        return <BsCloudLightning />

      case '13d':
      case '13n':
        return <BsSnow />

      case '50d':
      case '50n':
        return <RiMistFill />

      default:
        return <BsCloudSun />
    }
  }

  if (loading) return null
  if (!weather) return null

  return (
    <div className="weather d-flex align-items-center gap-1 fade-in px-2 py-1">
      <div
        style={{ width: 24, height: 24 }}
        className="d-flex align-items-center justify-content-center"
      >
        {getIconWeather(weather.weather[0].icon)}
      </div>
      <div className="align-middle">{Math.round(weather.main.temp || 0)}°</div>
    </div>
  )
}

export default Weather
