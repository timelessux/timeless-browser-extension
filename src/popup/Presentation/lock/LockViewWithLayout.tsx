import React, { useEffect, useState } from 'react'
import { mnemonicToAccount } from 'viem/accounts'
import { EPage } from '../../../../ts'
import { TValidate } from '../../../../ts/types'
import { getData, getMnemonic, validatePassword } from '../../../../utils/chromeStorage'
import { EOAWallet, WCWallet } from '../../../../utils/wallet'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { handleChangeCollapse } from '../../redux/slices/token/token.slice'
import { setLockWallet, setWallet } from '../../redux/slices/wallet/wallet.slice'
import ChatView from '../chat/ChatView'
import DashboardView from '../dashboard/DashboardView'
import Content from '../layout/Content'
import MenuSideBar from '../layout/MenuSideBar'
import WindowPlatter from '../layout/WindowPlatter'
import CollectionView from '../token/CollectionView'
import WelcomeView from '../welcome/WelcomeView'
import LockView from './LockView'
import SocialView from '../social/SocialView'
import TimelessXLogo from '../../assets/icons/TimelessXLogo'
import LinkButton from '../links/LinkButton'
import StashButton from '../stash/StashButton'
import FarcasterView from '../farCaster/FarcasterView'

interface Props {
  onUnlock?: (pwd: string) => void
  isHiddenHeader?: boolean
}

/** Deprecated: JUNE 19, 2024 */
export const LockViewWithLayout = ({ onUnlock, isHiddenHeader }: Props) => {
  const [inlineCollapsed, setInlineCollapsed] = useState<boolean>(false)
  const [moveY, setMoveY] = useState<number>(0)
  const [page, setPage] = useState<EPage>(EPage.DEFAULT)
  const [validate, setValidate] = useState<TValidate>({
    isValid: false,
    isChecked: false,
    message: ''
  })
  const [password, setPassword] = useState<string>('')
  const { steps, stepSellected } = useAppSelector((state) => state.tutorial)

  const { isLock } = useAppSelector((state) => state.wallet)
  const isVisibleMenuSideBar = useAppSelector((state) => state.slide.isVisibleMenuSideBar)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setLockWallet(false))
    if (steps.every((step) => step.isActive)) {
      dispatch(setLockWallet(true))
    }
  }, [steps, stepSellected])

  useEffect(() => {
    dispatch(handleChangeCollapse({ isCollapse: false }))
  }, [page])

  useEffect(() => {
    if (isVisibleMenuSideBar) setPage(EPage.PASSWORD)
    else setPage(EPage.DEFAULT)
  }, [isVisibleMenuSideBar])

  useEffect(() => {
    if (stepSellected && stepSellected.action.length > 0) {
      if (stepSellected.action.includes('changePageToLockView')) {
        !isLock && dispatch(setLockWallet(false))
        setPage(EPage.PASSWORD)
      }
      if (stepSellected.action.includes('changePageToChatView')) setPage(EPage.CHAT)
      if (stepSellected.action.includes('changePageToFarcasterlView')) setPage(EPage.FARCASTER)
      if (stepSellected.action.includes('changePageToDefault')) setPage(EPage.DEFAULT)
      if (stepSellected.action.includes('reload')) {
        dispatch(setLockWallet(true))
      }
    }
  }, [stepSellected])

  useEffect(() => {
    setValidate({
      isValid: false,
      isChecked: false,
      message: ''
    })
  }, [password])

  const submitPassword = async () => {
    const isValidPassword = await validatePassword(password)

    if (isValidPassword) {
      const mnemonic = await getMnemonic(password)
      if (mnemonic !== '') {
        const account = mnemonicToAccount(mnemonic)
        const storage = await getData('account')
        if (storage.account.address == account.address) {
          const wallet = new EOAWallet(
            account,
            storage.account.ensName || undefined,
            storage.account.avatar || undefined
          )
          dispatch(setWallet({ wallet: wallet }))
          dispatch(setLockWallet(false))
          onUnlock?.(password)
        }
        setValidate({
          message: '',
          isChecked: true,
          isValid: true
        })
      } else {
        setValidate({
          message: '',
          isChecked: true,
          isValid: true
        })
        dispatch(setLockWallet(false))
        onUnlock?.(password)
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
    } else {
      setValidate({
        message: 'Password does not match',
        isChecked: true,
        isValid: false
      })
      return
    }
  }

  return (
    <div className="h-100 d-flex flex-column">
      {(isHiddenHeader && isHiddenHeader) || (
        <div className="header">
          <div className="row align-items-center justify-content-between">
            <div className="col-5 d-flex align-items-center gap-2" style={{ height: 44 }}>
              <TimelessXLogo />
              {page !== EPage.SETTING && !isLock && page !== EPage.EXPLORE && steps[0].isActive && (
                <LinkButton disabled={isLock} />
              )}
              {page !== EPage.SETTING && !isLock && page !== EPage.EXPLORE && steps[0].isActive && (
                <StashButton disabled={isLock} />
              )}
            </div>
          </div>
        </div>
      )}
      {steps.length > 0 && !steps[0].isActive ? (
        <WelcomeView />
      ) : (
        <div className="hidden-scroll-bar" style={{ flex: 1, overflow: 'scroll' }}>
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="container h-100">
              <div className="row flex-nowrap justify-content-center h-100">
                <div className="col-auto position-relative">
                  {isVisibleMenuSideBar && (
                    <MenuSideBar
                      page={page}
                      setPage={setPage}
                      inlineCollapsed={inlineCollapsed}
                      disable={isLock}
                      moveY={moveY}
                      setInlineCollapsed={setInlineCollapsed}
                    />
                  )}
                </div>
                <div className="col-auto flex-fill">
                  <Content setMoveY={setMoveY} setPage={setPage} page={page}>
                    <WindowPlatter
                      page={page}
                      className="d-flex flex-column"
                      isVisibleFooter={page === EPage.DEFAULT}
                      setMoveY={setMoveY}
                    >
                      {page === EPage.DEFAULT && <DashboardView />}
                      {page === EPage.PASSWORD && (
                        <LockView
                          onUnlock={submitPassword}
                          password={password}
                          setPassword={setPassword}
                          validate={validate}
                        />
                      )}
                      {page === EPage.CHAT && <ChatView provider={'telegram'} />}
                      {page === EPage.COLLECTION && (
                        <CollectionView setPage={setPage} isVisible={page === EPage.COLLECTION} />
                      )}
                      {page === EPage.SOCIAL && <SocialView setSelectedPost={() => {}} />}
                      {page === EPage.FARCASTER && <FarcasterView setSelectedPost={() => {}} />}
                    </WindowPlatter>
                  </Content>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
