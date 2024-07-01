/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import 'viem/window'
import { WagmiProvider } from 'wagmi'
import { ELoginState } from '../../ts'
import { getData } from '../../utils/chromeStorage'
import { WCWallet } from '../../utils/wallet'
import AnimatedBackground from './Presentation/component/AnimatedBackground'
import PaginationTutorial from './Presentation/component/PaginationTutorial'
import Tutorial from './Presentation/component/Tutorial'
import { LoginView } from './Presentation/login'
import CautionView from './Presentation/login/component/CautionView'
import { TimelessApp } from './TimelessApp'
import './app.scss'
import { _queryClient, _wagmiConfig } from './configs/wagmiConfig'
import { AppContext } from './context/AppContext'
import { PageLoadingProvider } from './context/LoadingContext'
import { SettingProvider } from './context/SettingContext'
import { WalletProvider } from './context/WalletContext'
import { useAppDispatch, useAppSelector } from './redux/hook'
import { authActions } from './redux/slices/auth/authSlice'
import { cleanModalStack } from './redux/slices/modal/modal.slice'
import { setStep, setStepSellected } from './redux/slices/tutorial/tutorial.slice'
import { setLockWallet, setWallet } from './redux/slices/wallet/wallet.slice'

// const timeDisabled = 30
const defaultBackground =
  'https://res.cloudinary.com/timeless/image/upload/v1/app/Chrome%20extension/Background/0.avif'

function App() {
  const { getDailyData, installationId } = useContext(AppContext)
  const [loginState, setLoginState] = useState<ELoginState>(ELoginState.WARNING)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  const [linkBackground, setLinkBackground] = useState<string>()
  const [pwd, setPwd] = useState<string>('')
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const dispatch = useAppDispatch()
  const { steps } = useAppSelector((state) => state.tutorial)

  useEffect(() => {
    let fadeInTimer: NodeJS.Timeout
    let bgTimer: NodeJS.Timeout

    if (installationId && steps.every((e) => e.isActive)) {
      getDailyData(installationId, Intl.DateTimeFormat().resolvedOptions().timeZone).then(
        (response) => {
          if (response) {
            const bgElement = document.getElementById('background-app')
            fadeInTimer = setTimeout(() => {
              bgElement?.classList.add('fade-out')
            }, 800)
            bgTimer = setTimeout(() => {
              setLinkBackground(response.image.url)
            }, 1600)
            return
          }
        }
      )
    }

    if (!steps.every((e) => e.isActive)) return setLinkBackground(defaultBackground)

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(bgTimer)
    }
  }, [installationId, steps.every((e) => e.isActive)])

  // useEffect(() => {
  //   let count = 0

  //   if (steps.every((step) => step.isActive) && loginState === ELoginState.DASHBOARD) {
  //     if (!intervalId) {
  //       const intervalId = setInterval(updateCount, 1000)
  //       setIntervalId(intervalId)
  //     }
  //   } else {
  //     clearInterval(intervalId)
  //   }

  //   function reset() {
  //     count = 0
  //   }

  //   function updateCount() {
  //     count++
  //     if (count === timeDisabled) {
  //       setLoginState(ELoginState.LOCK)
  //       setUnlock(false)
  //       dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: false }))
  //       dispatch(setLockWallet(true))
  //       chrome.runtime.sendMessage({ type: 'updateLockStatus', unlock: false })
  //       reset()
  //     }
  //   }

  //   document.addEventListener('mousemove', reset)
  //   document.addEventListener('keydown', reset)
  // }, [loginState, steps, intervalId])

  useEffect(() => {
    getData('isLoggedIn').then(async (res) => {
      setIsLoggedIn(res ? true : false)
      if (res) {
        // TODO: Restore wallet for import mnemonic phrase flow
        // NOW: June 20, 2024: Hidden import wallet flow at WalletConnectView.tsx because removed enter lock screen password flow
        // const mnemonic = await getMnemonic('')
        // if (mnemonic !== '') {
        //   const account = mnemonicToAccount(mnemonic)
        //   const storage = await getData('account')
        //   if (storage.account.address == account.address) {
        //     const wallet = new EOAWallet(
        //       account,
        //       storage.account.ensName || undefined,
        //       storage.account.avatar || undefined
        //     )
        //     dispatch(setWallet({ wallet: wallet }))
        //     dispatch(setLockWallet(false))
        //   }
        // }

        dispatch(setLockWallet(false))
        setLoginState(ELoginState.DASHBOARD)
        const walletData = await getData('account')
        const wallet = new WCWallet(
          walletData.account,
          walletData.siweMessage,
          walletData.signature,
          walletData.avatar ?? undefined,
          walletData.ensName ?? undefined,
          walletData.chain
        )
        dispatch(setWallet({ wallet: wallet }))
      }
    })
    dispatch(cleanModalStack())
  }, [])

  // useEffect(() => {
  //   if (unlock !== undefined) {
  //     chrome.runtime.sendMessage({ type: 'updateUnlockStatus', unlock: unlock })
  //   }
  // }, [unlock])

  // useEffect(() => {
  //   if (pwd !== '') chrome.runtime.sendMessage({ type: 'updatePassword', password: pwd })
  // }, [pwd])

  useLayoutEffect(() => {
    async function checkTutorial() {
      const res = await getData('storeTutorialStep')
      if (res && res.steps && res.steps.length > 0) {
        dispatch(setStep({ steps: res.steps }))
        const firstStepNoneActive = res.steps.find((s) => !s.isActive)
        if (firstStepNoneActive) {
          dispatch(setStepSellected({ step: firstStepNoneActive }))
        } else {
          dispatch(setStepSellected({ step: null }))
        }
      } else {
        dispatch(
          setStep({
            steps: [
              {
                id: 'welcome',
                title: '',
                content: '',
                action: [''],
                isActive: false
              },
              {
                id: 'overview',
                title: 'Your Browser Buddy',
                content: 'Explore the new, beautiful open internet.',
                action: [''],
                isActive: false
              },
              {
                id: 'wallet',
                title: 'Smart Wallet with Style',
                content: 'Explore the new, beautiful open internet.',
                action: ['changePageToLockView'],
                isActive: false
              },

              {
                id: 'chat',
                title: 'Telegram Inside',
                content: 'Chat with frens where they are.',
                action: ['changePageToChatView'],
                isActive: false
              },

              {
                id: 'social',
                title: 'Post Once, Impress Everywhere',
                content: 'Smarter and new way to social.',
                action: ['changePageToFarcasterlView'],
                isActive: false
              },
              {
                id: 'links',
                title: 'Bookmark Reimgined',
                content: 'One-click access to your favorite sites.',
                action: ['changePageToDefault', 'deleteSaveRef', 'openLinkBox'],
                isActive: false
              },
              {
                id: 'stash',
                title: 'Stash and Restore',
                content: 'Declutter tabs and stay focused.',
                action: ['deleteSaveRef', 'openStashBox'],
                isActive: false,
                customNextButtonText: 'Finish'
              },
              {
                id: 'reload',
                title: '',
                content: '',
                action: ['reload'],
                isActive: true
              }
            ]
          })
        )
      }
    }
    checkTutorial()
  }, [])

  const acceptWarning = async () => {
    // const isPass = await hadEncryptStorage()
    // if (isPass) setLoginState(ELoginState.WALLET_CONNECT)
    // else setLoginState(ELoginState.PASSWORD)
    // setIntervalId(undefined)
    setLoginState(ELoginState.WALLET_CONNECT)
  }

  const renderLogin = useCallback(() => {
    if (loginState === ELoginState.WARNING) return <CautionView onClick={acceptWarning} />
    return (
      <WagmiProvider config={_wagmiConfig}>
        <QueryClientProvider client={_queryClient}>
          <RainbowKitProvider theme={darkTheme()} modalSize="compact">
            <WalletProvider>
              {loginState !== ELoginState.DASHBOARD && (
                <LoginView
                  loginState={loginState}
                  setLoginState={setLoginState}
                  setPassword={setPwd}
                  password={pwd}
                />
              )}
              {loginState === ELoginState.DASHBOARD && (
                <TimelessApp
                  linkBackground={linkBackground}
                  onLogout={onLogout}
                  setPwd={setPwd}
                  pwd={pwd}
                  setIntervalId={setIntervalId}
                />
              )}
            </WalletProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    )
  }, [loginState, linkBackground, _wagmiConfig])

  const onLogout = () => {
    setLoginState(ELoginState.WARNING)
    if (isLoggedIn) setIsLoggedIn(false)
    // This action to clear redux state
    dispatch(authActions.logOut())
  }

  if (steps.length === 0) return null

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <PageLoadingProvider>
        <SettingProvider>
          {isLoggedIn === false && renderLogin()}
          {isLoggedIn && (
            <WalletProvider>
              <WagmiProvider config={_wagmiConfig}>
                <QueryClientProvider client={_queryClient}>
                  {!steps.every((step) => step.isActive) && (
                    <>
                      <Tutorial />
                      <PaginationTutorial />
                    </>
                  )}
                  <AnimatedBackground url={linkBackground} />
                  {/* {unlock !== undefined && (
                    <>
                      {!unlock && (
                        <LockViewWithLayout
                          onUnlock={(pwd) => {
                            setLoginState(ELoginState.DASHBOARD)
                            setUnlock(true)
                            setPwd(pwd)
                            setIntervalId(undefined)
                          }}
                        />
                      )}
                      {unlock && (
                        <RainbowKitProvider theme={darkTheme()} modalSize="compact">
                          <TimelessApp
                            linkBackground={linkBackground}
                            onLogout={onLogout}
                            setPwd={setPwd}
                            pwd={pwd}
                            setIntervalId={setIntervalId}
                          />
                        </RainbowKitProvider>
                      )}
                    </>
                  )} */}
                  <RainbowKitProvider theme={darkTheme()} modalSize="compact">
                    <TimelessApp
                      linkBackground={linkBackground}
                      onLogout={onLogout}
                      setPwd={setPwd}
                      pwd={pwd}
                      setIntervalId={setIntervalId}
                    />
                  </RainbowKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </WalletProvider>
          )}
        </SettingProvider>
      </PageLoadingProvider>
    </div>
  )
}

export default App
