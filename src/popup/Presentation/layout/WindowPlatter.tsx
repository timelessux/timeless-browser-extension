import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { CgArrowsExpandLeft, CgCompressLeft } from 'react-icons/cg'
import { IoNotifications, IoSettingsOutline } from 'react-icons/io5'
import {
  MdKeyboardArrowLeft,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos
} from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { TwitterShareButton } from 'react-share'
import { EPage } from '../../../../ts'
import { getData } from '../../../../utils/chromeStorage'
import { ChatIcon } from '../../assets/icons/chatIcon'
import { FarcasterIcon } from '../../assets/icons/farcasterIcon'
//@ts-ignore
import lensWhite from '../../assets/images/lenny_white.png'
//@ts-ignore
import TimelessXIcon from '../../assets/images/timeless-x-icon.png'
import { AppContext } from '../../context/AppContext'
import { PlayerProvider } from '../../context/PlayerContext'
import { useAppSelector } from '../../redux/hook'
import { setVisibleMenuSideBar } from '../../redux/slices/slide/slide.slice'
import { setExpanded } from '../../redux/slices/social-post/social-post.slice'
import { setComponent } from '../../redux/slices/tutorial/tutorial.slice'
import ButtonWithIcon from '../component/ButtonWithIcon'
import ListNotification from '../component/Notifications'
import useClickOutside from '../hook/useClickOutside'
import { useHorizontalSwipe } from '../hook/useHorizontalSwipe'
import CreateExploreModal from '../links/CreateExploreModal'
import Information from '../social/component/Information/Information'
import SocialStatus from '../social/component/SocialStatus'
import SuggestedFrens from '../social/component/Suggested/SuggestedFrens'
import MenuSideBarSocial from './MenuSideBarSocial'
import TwitterLogo from '../../assets/icons/TwitterLogo'
import FarcasterStatus from '../farCaster/component/FarcasterStatus'

const chatProvider = [
  {
    id: 'telegram',
    name: 'Telegram'
  }
  // {
  //   id: 'xmtp',
  //   name: 'XMTP'
  // }
]

const WindowPlatter = ({
  children,
  className,
  page,
  isVisibleFooter,
  setPage,
  setMoveY,
  setChatActive,
  chatActive
}: {
  children: ReactNode
  className?: string
  page: EPage
  isVisibleFooter: boolean
  chatActive?: string
  setChatActive?: React.Dispatch<React.SetStateAction<string>>
  setPage?: React.Dispatch<React.SetStateAction<EPage>>
  setMoveY: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { quote } = useContext(AppContext)
  const dispatch = useDispatch()
  const isLock = useAppSelector((state) => state.wallet.isLock)
  const [curPos, setCurPos] = useState<number>(0)
  const [lensDisable, setLensDisable] = useState<boolean>(false)
  const [lensId, setLensId] = useState<string>('')
  const [isShowNotification, setShowNotification] = useState<boolean>(false)
  const { isVisibleHeader, isVisibleMenuSideBar: isVisibleMenu } = useAppSelector(
    (state) => state.slide
  )
  const pageSlice = useAppSelector((state) => state.pageSlice.page)

  const notiRef = useRef<HTMLDivElement>(null)
  useClickOutside({
    insideRef: notiRef,
    action: () => setShowNotification(false)
  })
  const isExpanded = useAppSelector((state) => state.socialPost.isExpanded)
  const isCollapseTokenDetail = useAppSelector((state) => state.token.isCollapse)

  const chatRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const socialRef = useRef<HTMLDivElement>(null)

  const lockViewSwipe = useHorizontalSwipe({
    onSwipedLeft: () => {
      if (page === EPage.DEFAULT) return
      if (page === EPage.COLLECTION || page === EPage.PASSWORD) {
        dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: false }))
        setPage?.(EPage.DEFAULT)
      }
    },
    onSwipedRight: () => {
      if (page === EPage.COLLECTION) return
      if (page === EPage.PASSWORD) return
      dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: true }))
      setMoveY(0)
      // if (isLock) return setPage?.(EPage.PASSWORD)
      setPage?.(EPage.COLLECTION)
    }
  })

  useEffect(() => {
    if (chatRef && chatRef.current && page === EPage.CHAT && bodyRef && bodyRef.current) {
      const data = chatRef.current.getBoundingClientRect()

      const refHeight = bodyRef.current.getBoundingClientRect().height
      dispatch(
        setComponent({
          ref: data,
          customHeight: refHeight / 17,
          customTop: 0,
          customWidth: 0,
          customLeft: 0,
          customRight: 0,
          topText: 280
        })
      )
    }
  }, [chatRef, page])

  useEffect(() => {
    if (socialRef && socialRef.current && (page === EPage.SOCIAL || page === EPage.FARCASTER)) {
      const data = socialRef.current.getBoundingClientRect()

      dispatch(
        setComponent({
          ref: data,
          customHeight: 40,
          customTop: 0,
          customWidth: 0,
          customLeft: 0,
          customRight: 0,
          topText: 250
        })
      )
    }
  }, [page, socialRef])

  useEffect(() => {
    getData('lensProfile').then((res) => {
      setLensDisable(!res)
      if (res) setLensId(res.id)
    })
  }, [])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', () => {})
      document.removeEventListener('mouseup', () => {})
      document.removeEventListener('mousemove', () => {})
      setCurPos(0)
    }
  }, [isVisibleMenu])

  if (page === EPage.CHAT) {
    return (
      <>
        <div
          className={`window-platter-telegram d-flex flex-column fade-in 
            ${className ? className : ''}`}
          onMouseDown={(event) => {
            setCurPos(event.pageX)
          }}
          onMouseMove={(event) => {
            if (curPos > 0) {
              dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: true }))
              const posDiff = event.pageX - curPos
              if (posDiff > 80) {
                setMoveY(100)
              } else {
                setMoveY(0)
              }
            }
          }}
          onMouseUp={() => setCurPos(0)}
        >
          <div className="left-background" ref={chatRef}></div>
          <div className="window-platter-header">
            <div
              className="left-header d-flex gap-2 pt-4 p-3 position-absolute"
              style={{ zIndex: 2 }}
            >
              <div
                style={{ width: 44 }}
                className="d-flex align-items-center justify-content-center"
              >
                <ButtonWithIcon
                  onClick={() => setPage?.(EPage.COLLECTION)}
                  icon={<MdKeyboardArrowLeft color="#fff" size={24} />}
                  className="button-chat hover"
                  visibleTitle={false}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="group-button-change-chat-view">
                  <div className="background p-1">
                    {chatProvider.map((provider) => (
                      <button
                        onClick={() => {
                          if (provider.id !== chatActive) {
                            setChatActive?.(provider.id)
                          }
                        }}
                        className={`button-custom py-2 px-3 hover ${
                          chatActive === provider.id && '--active'
                        }`}
                        key={provider.id}
                      >
                        {provider.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="right-header">
              <div
                style={{
                  fontFamily: 'Bold',
                  fontSize: '35px',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                  padding: 10
                }}
              >
                {chatActive}
              </div>
            </div> */}
          </div>
          <div
            className="window-platter-content w-100 d-flex align-items-center justify-content-center hidden-scroll-bar overflow-hidden"
            ref={bodyRef}
          >
            {children}
          </div>
        </div>
      </>
    )
  }

  if (page === EPage.SOCIAL) {
    return (
      <PlayerProvider>
        <div className="row gx-3 justify-content-center h-100">
          <div className="col-3 h-100">
            <div className="d-flex justify-content-end align-items-center h-100 w-100">
              <Information isExpanded={isExpanded} />
              <MenuSideBarSocial isExpanded={isExpanded} />
            </div>
          </div>
          <div className="col-5 h-100">
            <div className="d-flex flex-column justify-content-center h-100">
              <div
                className="window-platter-social fade-in px-3 d-flex flex-column w-100"
                ref={socialRef}
              >
                <div className="window-platter-header fade-in justify-content-between w-100">
                  <div className="d-flex gap-3 align-items-center">
                    <ButtonWithIcon
                      onClick={() => setPage?.(EPage.COLLECTION)}
                      icon={<MdKeyboardArrowLeft color="#fff" size={24} />}
                      className="button-header hover"
                      visibleTitle={false}
                    />
                    <div className="d-flex gap-2 align-items-center">
                      <ButtonWithIcon
                        icon={<img src={lensWhite} width={28} height={18} />}
                        className="button-header --disabled"
                        visibleTitle={false}
                      />
                      <span className="fw-bold fs-5">Lens</span>
                    </div>
                  </div>

                  <div
                    style={{ width: '20%', minHeight: 89 }}
                    className="right-header d-flex align-items-center justify-content-end pe-4 gap-2"
                  >
                    <ButtonWithIcon
                      icon={isExpanded ? <CgCompressLeft /> : <CgArrowsExpandLeft />}
                      className="button-header p-2 hover"
                      visibleTitle={false}
                      onClick={() => {
                        dispatch(setExpanded({ isExpanded: !isExpanded }))
                      }}
                    />
                  </div>
                </div>
                <SocialStatus disabled={false} />
                <div
                  className="window-platter-content fade-in w-100 position-relative d-flex justify-content-center pb-2 hidden-scroll-bar"
                  id="window-platter-content"
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
          <div className="col-3 h-100">
            <div className="d-flex justify-content-start align-items-center h-100 w-100">
              <SuggestedFrens isExpanded={isExpanded} />
            </div>
          </div>
        </div>
      </PlayerProvider>
    )
  }

  if (page === EPage.SOCIAL_COMMENT || page === EPage.FARCASTER_COMMENT) {
    return (
      <PlayerProvider>
        <div className="row gx-3 justify-content-center">
          <div className="col-3">
            <div className="d-flex justify-content-end align-items-center h-100 w-100">
              <Information isExpanded={isExpanded} />
              <MenuSideBarSocial isExpanded={isExpanded} />
            </div>
          </div>
          <div className="col-5">
            <div className="window-platter-social fade-in px-3 d-flex flex-column">
              <div className="window-platter-header fade-in justify-content-between">
                <div className="d-flex gap-3 align-items-center">
                  <ButtonWithIcon
                    onClick={() => setPage?.(EPage.SOCIAL)}
                    icon={<MdKeyboardArrowLeft color="#fff" size={24} />}
                    className="button-header hover"
                    visibleTitle={false}
                  />
                  <div className="d-flex gap-2 align-items-center">
                    <ButtonWithIcon
                      icon={<img src={lensWhite} width={28} height={18} />}
                      className="button-header --disabled"
                      visibleTitle={false}
                    />
                    <span className="fw-bold fs-5">Lens</span>
                  </div>
                </div>

                <div
                  style={{ width: '20%', minHeight: 89 }}
                  className="right-header d-flex align-items-center justify-content-end pe-4 gap-2"
                >
                  <ButtonWithIcon
                    icon={isExpanded ? <CgCompressLeft /> : <CgArrowsExpandLeft />}
                    className="button-header p-2 hover"
                    visibleTitle={false}
                    onClick={() => {
                      dispatch(setExpanded({ isExpanded: !isExpanded }))
                    }}
                  />
                </div>
              </div>
              <SocialStatus disabled={false} />
              <div
                className="window-platter-content fade-in w-100 position-relative d-flex justify-content-center pb-2 hidden-scroll-bar"
                id="window-platter-content"
              >
                {children}
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex justify-content-start align-items-center h-100 w-100">
              <SuggestedFrens isExpanded={isExpanded} />
            </div>
          </div>
        </div>
      </PlayerProvider>
    )
  }

  if (page === EPage.FARCASTER) {
    return (
      <PlayerProvider>
        <div className="row gx-3 justify-content-center h-100">
          <div className="col-3 h-100">
            <div className="d-flex justify-content-end align-items-center h-100 w-100">
              <Information isExpanded={isExpanded} />
              <MenuSideBarSocial isExpanded={isExpanded} />
            </div>
          </div>
          <div className="col-5 h-100">
            <div className="d-flex flex-column justify-content-center h-100">
              <div
                className="window-platter-social fade-in px-3 d-flex flex-column w-100"
                ref={socialRef}
              >
                <div className="window-platter-header fade-in justify-content-between w-100">
                  <div className="d-flex gap-3 align-items-center">
                    <ButtonWithIcon
                      onClick={() => setPage?.(EPage.COLLECTION)}
                      icon={<MdKeyboardArrowLeft color="#fff" size={24} />}
                      className="button-header hover"
                      visibleTitle={false}
                    />
                    <div className="d-flex gap-2 align-items-center">
                      <ButtonWithIcon
                        icon={<FarcasterIcon />}
                        className="button-header --disabled"
                        visibleTitle={false}
                      />
                      <span className="fw-bold fs-5">Farcaster</span>
                    </div>
                  </div>

                  <div
                    style={{ width: '20%', minHeight: 89 }}
                    className="right-header d-flex align-items-center justify-content-end pe-4 gap-2"
                  >
                    <ButtonWithIcon
                      icon={isExpanded ? <CgCompressLeft /> : <CgArrowsExpandLeft />}
                      className="button-header p-2 hover"
                      visibleTitle={false}
                      onClick={() => {
                        dispatch(setExpanded({ isExpanded: !isExpanded }))
                      }}
                    />
                  </div>
                </div>
                <FarcasterStatus disabled={false} />
                <div
                  className="window-platter-content fade-in w-100 position-relative d-flex justify-content-center pb-2 hidden-scroll-bar"
                  id="window-platter-content"
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
          <div className="col-3 h-100">
            <div className="d-flex justify-content-start align-items-center h-100 w-100">
              <SuggestedFrens isExpanded={isExpanded} />
            </div>
          </div>
        </div>
      </PlayerProvider>
    )
  }

  return (
    <>
      <div
        className={`window-platter gap-1 
          ${isCollapseTokenDetail ? '--collapse-detail-token' : ''} 
          ${page === EPage.COLLECTION_DETAIL ? '' : 'd-none'}`}
      >
        {children}
      </div>

      <div
        className={`window-platter fade-in
          ${page === EPage.COLLECTION_DETAIL ? 'd-none' : ''}`}
        {...lockViewSwipe}
      >
        <div className={`${className ? className : ''} h-100`}>
          {isVisibleHeader && (
            <div className="window-platter-header fade-in px-4 pt-4 pb-2 d-flex gap-2 justify-content-between">
              <div className="left-header d-flex gap-2">
                {page !== EPage.SETTING && (
                  <ButtonWithIcon
                    onClick={() => setPage?.(EPage.CHAT)}
                    icon={<ChatIcon color="#fff" />}
                    className="button-header p-2 hover"
                    visibleTitle={false}
                    // disabled={isLock}
                  />
                )}
                {page !== EPage.SETTING && (
                  <ButtonWithIcon
                    icon={<FarcasterIcon />}
                    onClick={() => setPage?.(EPage.FARCASTER)}
                    className="button-header p-2 hover"
                    visibleTitle={false}
                    disabled={true}
                  />
                )}
                {/* {page !== EPage.SETTING && (
                  <ButtonWithIcon
                    onClick={() => setPage?.(EPage.SOCIAL)}
                    icon={<img src={lensWhite} width={28} height={18} />}
                    className="button-header p-2 hover"
                    visibleTitle={false}
                    disabled={isLock || lensDisable}
                  />
                )} */}
                {page === EPage.SETTING && (
                  <ButtonWithIcon
                    onClick={() => setPage?.(EPage.COLLECTION)}
                    icon={<MdKeyboardArrowLeft color="#fff" size={24} />}
                    className="button-header hover"
                    visibleTitle={false}
                  />
                )}
              </div>
              <div className="name-page d-flex align-items-center">
                {page !== EPage.PASSWORD &&
                  page !== EPage.COLLECTION &&
                  page !== EPage.DEFAULT &&
                  page !== EPage.EXPLORE &&
                  page}
                {page === EPage.EXPLORE && <img src={TimelessXIcon} width={28} height={28} />}
              </div>
              <div className="right-header d-flex gap-2">
                {/* {!isLock && <SearchBox />} */}
                {/* <div ref={notiRef}>
                  {page !== EPage.SETTING && (
                    <ButtonWithIcon
                      icon={<IoNotifications />}
                      className="button-header p-2 hover"
                      visibleTitle={false}
                      disabled={isLock || lensDisable}
                      onClick={() => setShowNotification(!isShowNotification)}
                    />
                  )}
                  {isShowNotification && page !== EPage.SETTING && (
                    <ListNotification lensId={lensId} setShowNotification={setShowNotification} />
                  )}
                </div> */}

                {page !== EPage.SETTING && (
                  <ButtonWithIcon
                    icon={<IoSettingsOutline />}
                    className="button-header p-2 hover"
                    visibleTitle={false}
                    disabled={false}
                    onClick={() => setPage?.(EPage.SETTING)}
                  />
                )}
              </div>
            </div>
          )}
          <div className="window-platter-content fade-in w-100 hidden-scroll-bar">
            {page !== EPage.EXPLORE && (
              <div className="d-flex justify-content-center h-100">{children}</div>
            )}
            {page === EPage.EXPLORE && <div className="d-flex h-100">{children}</div>}
          </div>
          {isVisibleFooter ? (
            <div
              className="window-platter-header p-2 d-flex gap-2 justify-content-center pb-5"
              style={{ minHeight: 83 }}
            >
              <div className="footer-text fade-in position-relative">
                {quote?.content && (
                  <div className="quote fade-in">&quot;{quote && quote.content}&quot;</div>
                )}
                {quote && quote.author !== 'Unknown' && (
                  <div className="author text-center position-absolute">
                    <span className="align-middle me-1">{quote.author}</span>
                    <TwitterShareButton
                      url={`\n— ${quote.author}`}
                      via="timelesswallet"
                      title={`"${quote.content}"`}
                    >
                      <TwitterLogo className="cursor-pointer" style={{ width: 12 }} />
                    </TwitterShareButton>
                  </div>
                )}
              </div>
            </div>
          ) : (
            page === EPage.DEFAULT && (
              <div
                className="window-platter-header p-2 d-flex gap-2 justify-content-center"
                style={{ fontSize: 18, minHeight: 46, opacity: 0 }}
              >
                a
              </div>
            )
          )}
        </div>

        {page === EPage.DEFAULT && pageSlice === EPage.DEFAULT && (
          <div className="change-page position-absolute" style={{ right: 20, top: '50%' }}>
            <ButtonWithIcon
              className="button-header p-2 hover"
              icon={<MdOutlineArrowForwardIos />}
              visibleTitle={false}
              onClick={() => {
                dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: true }))
                setMoveY(0)
                if (isLock) {
                  setPage?.(EPage.PASSWORD)
                } else {
                  setPage?.(EPage.COLLECTION)
                }
              }}
            />
          </div>
        )}
        {(page === EPage.COLLECTION || page === EPage.PASSWORD) && pageSlice === EPage.DEFAULT && (
          <div className="change-page position-absolute" style={{ left: 20, top: '50%' }}>
            <ButtonWithIcon
              className="button-header p-2 hover"
              icon={<MdOutlineArrowBackIos />}
              visibleTitle={false}
              onClick={() => {
                dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: false }))
                setPage?.(EPage.DEFAULT)
                setMoveY(100)
              }}
            />
          </div>
        )}
        <CreateExploreModal />
      </div>
    </>
  )
}

export default WindowPlatter
