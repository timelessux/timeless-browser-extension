import { Switch } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { FaEarthAmericas } from 'react-icons/fa6'
import useClickOutside from '../hook/useClickOutside'
import { useDashboardModel } from './DashboardViewModel'
import TimeZone from './component/TimeZone'
import { useSettingProvider } from '../../context/SettingContext'
import { usePageLoading } from '../../context/LoadingContext'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { setComponent } from '../../redux/slices/tutorial/tutorial.slice'

const DashboardView = () => {
  const [isShowMilitaryClock, setIsShowMilitaryClock] = useState<boolean>(false)
  const [isShowTimezone, setIsShowTimezone] = useState<boolean>(false)
  const { mantra, getMantraFromLocal } = useDashboardModel()
  const { currentTime, setMilitaryFormat, militaryFormat } = useSettingProvider()
  const changeRef = useRef<HTMLDivElement>(null)
  const { destroyMessage } = usePageLoading()
  const dashboardRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const isLock = useAppSelector((state) => state.wallet.isLock)
  const { stepSellected } = useAppSelector((state) => state.tutorial)

  useEffect(() => {
    if (
      dashboardRef &&
      dashboardRef.current &&
      stepSellected &&
      stepSellected.id !== 'links' &&
      stepSellected.id !== 'stash'
    ) {
      const data = dashboardRef.current.getBoundingClientRect()
      dispatch(
        setComponent({
          ref: data,
          customHeight: 600,
          customTop: -280,
          customWidth: 720,
          customLeft: -360,
          customRight: 100,
          topText: 100
        })
      )
    }
  }, [dashboardRef, stepSellected])

  useClickOutside({ insideRef: changeRef, action: () => setIsShowMilitaryClock(false) })

  useEffect(() => {
    destroyMessage()
    getMantraFromLocal()
  }, [])

  return (
    <>
      <div className="dashboard-page fade-in h-100 d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column" ref={dashboardRef}>
          <div className="date text-center">{currentTime.format('MMMM D')}</div>
          <div id="ctn-time" className="ctn-time d-flex align-items-center justify-content-center">
            <div className="position-relative">
              <div className="ctn-icon">
                <div
                  className={`icon cursor-pointer ${isLock ? 'disable' : ''}`}
                  onClick={(e) => {
                    if (isLock) return
                    e.stopPropagation()
                    setIsShowTimezone(!isShowTimezone)
                  }}
                >
                  <FaEarthAmericas size={22} />
                </div>
                {isShowTimezone && (
                  <TimeZone setIsShowTimezone={setIsShowTimezone} isShowTimezone={isShowTimezone} />
                )}
              </div>
            </div>
            <div className="time mx-3">
              {militaryFormat ? currentTime.format('HH:mm') : currentTime.format('hh:mm A')}
            </div>
            <div className="position-relative">
              <div
                className="ctn-icon"
                onClick={(e) => {
                  if (isLock) return
                  e.stopPropagation()
                  setIsShowMilitaryClock(!isShowMilitaryClock)
                }}
              >
                <div className={`icon ${isLock ? 'disable' : 'cursor-pointer'}`}>
                  <BsThreeDots size={22} />
                </div>
              </div>
              <div
                className={`d-flex justify-items-center ctn-military-clock px-2 py-2 position-absolute ${
                  isShowMilitaryClock ? 'military-clock-active background-box' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                ref={changeRef}
              >
                <div className="me-3 rounded">Military clock (24-hour)</div>
                <Switch
                  checked={militaryFormat}
                  onChange={() => {
                    setMilitaryFormat(!militaryFormat)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="ctn-mantra text-center d-flex align-items-center justify-content-center gap-2">
            <div className="mantra">{mantra}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardView
