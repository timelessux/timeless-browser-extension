import React, { SetStateAction, useEffect, useState } from 'react'
import { EPage } from '../../../../ts'
import { getData, setIsFirstTimeOpen } from '../../../../utils/chromeStorage'
import { Publication } from '../../Domain/Model/Publication'
import TimelessXLogo from '../../assets/icons/TimelessXLogo'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { articleActions, selectArticleState } from '../../redux/slices/articles/articleSlice'
import { handleChangeCollapse } from '../../redux/slices/token/token.slice'
import BridgeView from '../bridge/BridgeView'
import BuyView from '../buy/BuyView'
import ChatView from '../chat/ChatView'
import DashboardView from '../dashboard/DashboardView'
import DiscoverView from '../explore/discover/DiscoverView'
import { LockViewWithLayout } from '../lock/LockViewWithLayout'
import { AccountModal } from '../modal/AccountModal'
import { NetworkModal } from '../modal/NetworkModal'
import SendView from '../send/SendView'
import SettingView from '../setting/SettingView'
import SocialView from '../social/SocialView'
import PostComment from '../social/component/PostComment'
import SwapView from '../swap/SwapView'
import CollectionDetail from '../token/CollectionDetail/CollectionDetail'
import CollectionView from '../token/CollectionView'
import WelcomeView from '../welcome/WelcomeView'
import Content from './Content'
import MenuSideBar from './MenuSideBar'
import WindowPlatter from './WindowPlatter'
import { WalletAccount } from './component/WalletAccount'
import Weather from './component/weather/Weather'
import LinkButton from '../links/LinkButton'
import StashButton from '../stash/StashButton'
import FarcasterView from '../farCaster/FarcasterView'
import FarcasterPostComment from '../farCaster/component/FarcasterPostComment'

interface Props {
  logout: () => void
  setPwd: React.Dispatch<SetStateAction<string>>
  setIntervalId: React.Dispatch<SetStateAction<NodeJS.Timeout | undefined>>
}

const Layout = ({ logout, setPwd, setIntervalId }: Props) => {
  const [page, setPage] = useState<EPage>(EPage.DEFAULT)
  const [inlineCollapsed, setInlineCollapsed] = useState<boolean>(false)
  const [moveY, setMoveY] = useState<number>(0)
  const [chatActive, setChatActive] = useState<string>('telegram')
  const [selectedPost, setSelectedPost] = useState<Publication>()
  const [isHoverHeader, setIsHoverHeader] = useState<boolean>(false)

  const { isLock, wallet } = useAppSelector((state) => state.wallet)
  const isVisibleMenuSideBar = useAppSelector((state) => state.slide.isVisibleMenuSideBar)
  const isCollapseTokenDetail = useAppSelector((state) => state.token.isCollapse)
  const { isCollapse: isCollapseExplorerDetail } = useAppSelector(selectArticleState)
  const { stepSellected, steps } = useAppSelector((state) => state.tutorial)

  const dispatch = useAppDispatch()

  /** first time on the wallet, let’s have MenuSideBar expanded for 3 seconds and collapse so that the user knows that this can hover */
  useEffect(() => {
    if (page === EPage.DEFAULT && steps.every((step) => step.isActive)) {
      getData('isFirstTimeOpen').then((isFirstTimeOpen) => {
        if (isFirstTimeOpen) {
          setInlineCollapsed(true)
          setTimeout(() => {
            setInlineCollapsed(false)
            setIsFirstTimeOpen(false)
          }, 3000)
        }
      })
    }
  }, [page, steps])
  /** end */

  useEffect(() => {
    if (selectedPost) setPage(EPage.SOCIAL_COMMENT)
  }, [selectedPost])

  useEffect(() => {
    dispatch(handleChangeCollapse({ isCollapse: false }))
    dispatch(articleActions.setIsCollapse(false))
  }, [page])

  useEffect(() => {
    if (stepSellected && stepSellected.action.length > 0) {
      if (stepSellected.action.includes('changePageToChatView')) setPage(EPage.CHAT)
      if (stepSellected.action.includes('changePageToFarcasterlView')) setPage(EPage.FARCASTER)
      if (stepSellected.action.includes('changePageToDefault')) setPage(EPage.DEFAULT)
      if (stepSellected.action.includes('changePageToLockView')) setPage(EPage.PASSWORD)
      if (stepSellected.action.includes('reload')) setPage(EPage.DEFAULT)
    }
  }, [stepSellected])

  // useEffect(() => {
  //   if (!isLock && steps.every((step) => step.isActive)) {
  //     setPage(EPage.COLLECTION)
  //   }
  // }, [isLock])

  return (
    <div className="h-100 d-flex flex-column">
      <div
        className="header"
        onMouseEnter={() => {
          setIsHoverHeader(true)
        }}
        onMouseLeave={() => {
          setIsHoverHeader(false)
        }}
      >
        <div className="row align-items-center justify-content-between">
          <div className="col-5 d-flex align-items-center gap-4" style={{ height: 44 }}>
            <TimelessXLogo
              className="cursor-pointer"
              onClick={() => setInlineCollapsed((prev) => !prev)}
            />
            {steps[0].isActive && (
              <div className="d-flex align-items-center gap-2">
                {page !== EPage.SETTING && !isLock && page !== EPage.EXPLORE && (
                  <LinkButton disabled={isLock} />
                )}
                {page !== EPage.SETTING && !isLock && page !== EPage.EXPLORE && (
                  <StashButton disabled={isLock} />
                )}
              </div>
            )}
          </div>
          {wallet && steps.every((step) => step.isActive) && (
            <div className="col-5 d-flex gap-2 justify-content-end">
              <WalletAccount isVisible={page !== EPage.DEFAULT || isHoverHeader} />
              <Weather />
            </div>
          )}
        </div>
      </div>
      {page === EPage.PASSWORD && (
        <LockViewWithLayout
          isHiddenHeader
          onUnlock={(pwd) => {
            setPwd(pwd)
            setPage(EPage.COLLECTION)
            setIntervalId(undefined)
          }}
        />
      )}
      {steps.length > 0 && !steps[0].isActive ? (
        <WelcomeView />
      ) : (
        <div className="hidden-scroll-bar" style={{ flex: 1, overflow: 'scroll' }}>
          {page !== EPage.SOCIAL &&
          page !== EPage.SOCIAL_COMMENT &&
          page !== EPage.FARCASTER &&
          page !== EPage.FARCASTER_COMMENT ? (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="container h-100">
                <div className={'row flex-nowrap justify-content-center h-100'}>
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
                  <div
                    className={`col-auto ${
                      isCollapseTokenDetail || isCollapseExplorerDetail ? '' : 'flex-fill'
                    }`}
                    style={{ transition: '0.2s all linear' }}
                  >
                    <Content setMoveY={setMoveY} setPage={setPage} page={page}>
                      <WindowPlatter
                        page={page}
                        setPage={setPage}
                        className={`${page === EPage.CHAT ? '' : 'd-flex flex-column'}`}
                        isVisibleFooter={page === EPage.DEFAULT}
                        setMoveY={setMoveY}
                        chatActive={chatActive}
                        // setChatActive={setChatActive}
                      >
                        {wallet && (
                          <>
                            <NetworkModal />
                            <AccountModal onDisconnect={logout} />
                          </>
                        )}

                        {page === EPage.DEFAULT && <DashboardView />}
                        {page === EPage.SWAP && <SwapView />}
                        {page === EPage.BRIDGE && <BridgeView />}
                        {page === EPage.SEND && <SendView />}
                        {page === EPage.BUY && <BuyView />}
                        {page === EPage.EXPLORE && <DiscoverView />}
                        {page === EPage.CHAT && <ChatView provider={chatActive} />}
                        {page === EPage.SETTING && <SettingView />}
                        <CollectionView setPage={setPage} isVisible={page === EPage.COLLECTION} />
                        <CollectionDetail
                          setPage={setPage}
                          isVisible={page === EPage.COLLECTION_DETAIL}
                        />
                      </WindowPlatter>
                    </Content>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container-fluid position-relative h-100">
              <div className="d-flex align-items-center h-100">
                <Content setMoveY={setMoveY} setPage={setPage} page={page}>
                  <WindowPlatter
                    page={page}
                    setPage={setPage}
                    isVisibleFooter={false}
                    setMoveY={setMoveY}
                  >
                    {wallet && (
                      <>
                        <NetworkModal />
                        <AccountModal onDisconnect={logout} />
                      </>
                    )}
                    {page === EPage.FARCASTER && (
                      <FarcasterView setSelectedPost={setSelectedPost} />
                    )}
                    {page === EPage.FARCASTER_COMMENT && (
                      <FarcasterPostComment post={selectedPost} setPost={setSelectedPost} />
                    )}
                    {page === EPage.SOCIAL && <SocialView setSelectedPost={setSelectedPost} />}
                    {page === EPage.SOCIAL_COMMENT && selectedPost && (
                      <PostComment post={selectedPost} setPost={setSelectedPost} />
                    )}
                  </WindowPlatter>
                </Content>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Layout
