import { useAccountModal } from '@rainbow-me/rainbowkit'
import React, { SetStateAction, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { getData, logout } from '../../utils/chromeStorage'
import { TokenFile, tokenFiles } from '../../utils/mapChains'
import AnimatedBackground from './Presentation/component/AnimatedBackground'
import PaginationTutorial from './Presentation/component/PaginationTutorial'
import Tutorial from './Presentation/component/Tutorial'
import Layout from './Presentation/layout'
import { useCollectionViewModel } from './Presentation/token/CollectionViewModel'
import Redirect from './Redirect'
import { usePageLoading } from './context/LoadingContext'
import { useAppDispatch, useAppSelector } from './redux/hook'
import { popModal } from './redux/slices/modal/modal.slice'
import { setTotal } from './redux/slices/token-setting/token-setting.slice'
import { setIsFetchCollection, tokenActions } from './redux/slices/token/token.slice'
import { logoutWallet } from './redux/slices/wallet/wallet.slice'

interface TimelessAppProps {
  linkBackground?: string
  onLogout(): void
  setPwd: React.Dispatch<SetStateAction<string>>
  pwd: string
  setIntervalId: React.Dispatch<SetStateAction<NodeJS.Timeout | undefined>>
}

export const TimelessApp = (props: TimelessAppProps) => {
  const { linkBackground, onLogout, setPwd, pwd, setIntervalId } = props

  const { steps } = useAppSelector((state) => state.tutorial)
  const [loading, setLoading] = useState<boolean>(false)
  const [onClickDisconnect, setOnClickDisconnect] = useState<boolean>(false)
  const { disconnect } = useDisconnect()

  const dispatch = useAppDispatch()
  const { openMessage } = usePageLoading()

  useConnect({
    mutation: {
      onError() {
        openMessage('error', 'Something wrong!')
      }
    }
  })

  const { getCollections } = useCollectionViewModel()
  const { accountModalOpen } = useAccountModal()
  const { isDisconnected } = useAccount()
  const { wallet } = useAppSelector((state) => state.wallet)
  const { isFetchCollection } = useAppSelector((state) => state.token)

  useEffect(() => {
    if (wallet?.account.address) {
      getData('tokenSetting').then((response) => {
        if (response) {
          const _listToken: TokenFile[] = JSON.parse(response)
          dispatch(tokenActions.setListToken(_listToken))
          return
        }

        const _defaultActiveToken = tokenFiles.map((tokenFile) => ({
          ...tokenFile,
          data: tokenFile.data.map((e, i) => ({
            ...e,
            active: i === 0 // first item should be native token
          }))
        }))

        dispatch(tokenActions.setListToken(_defaultActiveToken))
      })
    }
  }, [wallet])

  useEffect(() => {
    if (!wallet?.account || isFetchCollection) return
    getCollections({
      walletAddress: wallet.account.address,
      cursor: null,
      isLoadMore: false,
      isFilterAZ: true
    })
  }, [wallet?.account])

  useEffect(() => {
    if (accountModalOpen) {
      document
        .querySelector('button[data-testid="rk-disconnect-button"]')
        ?.addEventListener('click', () => {
          logout(pwd)
          document
            .querySelector('div[aria-labelledby="rk_account_modal_title"]')
            ?.setAttribute('style', 'display: none')
        })
    }
  }, [accountModalOpen])

  const disconnectWallet = async () => {
    setLoading(true)
    setOnClickDisconnect(true)
    disconnect()
  }

  useEffect(() => {
    if (isDisconnected && onClickDisconnect) {
      dispatch(logoutWallet())
      dispatch(popModal())
      dispatch(setTotal('0'))
      dispatch(setIsFetchCollection(false))
      logout(pwd).then((res) => {
        if (res) {
          setLoading(false)
          setOnClickDisconnect(false)
          onLogout()
          chrome.runtime.sendMessage({ type: 'updateWallet' })
        }
      })
    }
  }, [isDisconnected, onClickDisconnect])

  if (loading) return <Redirect />

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
      className="parent-app"
    >
      {!steps.every((step) => step.isActive) && (
        <>
          <Tutorial />
          <PaginationTutorial />
        </>
      )}
      <AnimatedBackground url={linkBackground} />
      <Layout logout={disconnectWallet} setPwd={setPwd} setIntervalId={setIntervalId} />
    </div>
  )
}
