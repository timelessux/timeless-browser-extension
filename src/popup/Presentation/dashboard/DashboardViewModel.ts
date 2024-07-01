import { useState } from 'react'
import BaseService from '../../../../services/axios'
import { getData, storeMantra } from '../../../../utils/chromeStorage'
import { checkSameDay } from '../../../../utils/date'
import { Notification } from '../../Domain/Model/Notification'
import { DashboardRepository, UserRepository } from '../../Domain/Repository'

const axiosClient = new BaseService()

export const useDashboardModel = () => {
  const [mantra, setMantra] = useState<string>('')

  const [notifications, setNotifications] = useState<Array<Notification>>([])
  const [isLoadingNoti, setIsLoadingNoti] = useState<boolean>(false)
  const [errorNoti, setErrorNoti] = useState<string | null>(null)
  const [nextCursorNoti, setNextCursorNoti] = useState<string>()
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)

  const randomMantra = () => {
    const listMantra = DashboardRepository().getMantras()
    const min = 0
    const max = listMantra.length
    const randomNumber = Math.round(Math.random() * (max - min) + min)
    storeMantra({ mantra: listMantra[randomNumber], createdAt: new Date().toISOString() })
    return listMantra[randomNumber]
  }

  const getMantraFromLocal = async () => {
    const localMantra: { mantra: string; createdAt: string } | undefined =
      await getData('storeMantra')
    if (!localMantra) return setMantra(randomMantra())
    if (checkSameDay(localMantra?.createdAt)) return setMantra(localMantra.mantra)
    setMantra(randomMantra())
  }

  async function getNotification({
    lensId,
    isFetchMore,
    cursor
  }: {
    lensId: string
    isFetchMore: boolean
    cursor: string
  }) {
    try {
      !isFetchMore && setIsLoadingNoti(true)
      const res = await DashboardRepository().getNotification(lensId, cursor)
      setIsLoadingNoti(false)
      if (res) {
        if (isFetchMore) {
          setNotifications((prev) => [...prev, ...res.items])
        } else {
          setNotifications(res.items)
        }
      }
      setNextCursorNoti(res.cursor?.replace('+', '%2B'))
    } catch (error) {
      setErrorNoti(error)
    }
  }

  async function getProfile(address: string) {
    setIsLoadingProfile(true)
    const res = await UserRepository(axiosClient).getProfileByHandles(address)
    setIsLoadingProfile(false)
    if (res.data) {
      return res.data['getProfileByHandles'][0]
    }
  }

  return {
    mantra,
    notifications,
    getProfile,
    isLoadingNoti,
    getNotification,
    errorNoti,
    nextCursorNoti,
    isLoadingProfile,
    getMantraFromLocal
  }
}
