import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { EModals } from '../../../../ts'
import { BsThreeDots } from 'react-icons/bs'
import Tabs from '../../assets/images/tabs.png'
import { getData, storeStashPage } from '../../../../utils/chromeStorage'
import ListStash from './ListStash'
import { ConfirmModal } from '../modal/ConfirmModal'
import { popModal } from '../../redux/slices/modal/modal.slice'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import { usePageLoading } from '../../context/LoadingContext'
import {
  DataSession,
  deleteStash,
  setCurrentDataStashWindow
} from '../../redux/slices/stash/stash.slice'
import { numberFormatter } from '../../../../utils/textConvert'
import { formatDate } from '../../../../utils/date'
import StashDetail from './StashDetail'
import { setComponent } from '../../redux/slices/tutorial/tutorial.slice'

const enum EStateBox {
  DETAIL = 'detail',
  LIST = 'list'
}

type Props = {
  disabled: boolean
}

const StashButton = ({ disabled }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [openActionTop, setOpenActionTop] = useState<boolean>(false)
  const [stateBox, setStateBox] = useState<EStateBox>(EStateBox.LIST)
  const isLock = useAppSelector((state) => state.wallet.isLock)

  const modalStack = useAppSelector((state) => state.modal.modalStack)
  const isOpen = modalStack.find((modal) => modal.name === EModals.CONFIRM_MODAL) !== undefined

  const dataStashWindow = useAppSelector((state) => state.stash.dataStashWindow)
  const stashSelected = useAppSelector((state) => state.stash.stashSelected)
  const ref = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const { stepSellected, steps } = useAppSelector((state) => state.tutorial)

  const dispatch = useAppDispatch()
  const { openMessage } = usePageLoading()

  const deleteStashWindow = () => {
    if (!stashSelected) return

    dispatch(deleteStash({ stashWindow: stashSelected }))
    const currentData = dataStashWindow
    const newData = currentData.filter((data) => data.uniqueId !== stashSelected.uniqueId)

    storeStashPage(newData)

    openMessage(
      'success',
      <span>
        <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Stashed Deleted!</div>
        <div style={{ textAlign: 'left', fontFamily: 'Regular', wordBreak: 'break-word' }}>
          Stash from {stashSelected?.time} deleted
        </div>
      </span>,
      <AiOutlineMinusCircle color="#FFD60A" size={24} />
    )
  }

  const handleCloseStashModal = () => {
    if (!isOpen) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (boxRef && boxRef.current) {
      const data = boxRef.current.getBoundingClientRect()
      dispatch(
        setComponent({
          ref: data,
          customHeight: 90,
          customTop: -50,
          customWidth: 0,
          customLeft: 2,
          customRight: 0,
          topText: 0
        })
      )
    }
  }, [ref, open, stepSellected])

  useEffect(() => {
    if (stepSellected && stepSellected.action.length > 0) {
      if (stepSellected.action.includes('openStashBox')) setOpen(true)
    }
  }, [stepSellected])

  const restoreLastSession = () => {
    const listTabs = dataStashWindow[0].stash.flatMap((innerArray) =>
      innerArray.tabs.map((obj) => obj)
    )
    dataStashWindow[0].stash.map((window) => {
      chrome.windows.create({
        focused: window.focused,
        height: window.height,
        incognito: window.incognito,
        url: listTabs.filter((tab) => tab.windowId === window.id).map((tab) => tab.url) as string[],
        width: window.width
      })
    })
  }

  useEffect(() => {
    if (isLock) {
      setOpen(false)
    }
  }, [isLock])

  useEffect(() => {
    if (stepSellected && stepSellected.id === 'stash') return
    if (stepSellected && stepSellected.id === 'reload') {
      handleCloseStashModal()
    }

    function handleClickOutside(event) {
      const popOver = document.getElementsByClassName('ant-popover-open')
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        (!popOver || popOver.length === 0)
      ) {
        handleCloseStashModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, stepSellected])

  const getLink = () => {
    if (!steps.every((step) => step.isActive)) return
    let window: chrome.windows.Window[] = []
    let tab: chrome.tabs.Tab[] = []
    const time = formatDate(new Date())

    chrome.windows.getAll({}, function (listWindow) {
      window = listWindow

      chrome.tabs.query({}, function (listTabs) {
        tab = listTabs

        const newData: DataSession[] = window.map((w) => ({
          alwaysOnTop: w.alwaysOnTop,
          focused: w.focused,
          height: w.height,
          id: w.id,
          incognito: w.incognito,
          left: w.left,
          state: w.state,
          top: w.top,
          type: w.type,
          width: w.width,
          time: `${time}`,
          tabs: tab.filter(
            (t) =>
              t.windowId === w.id &&
              ((w.focused === true && t.active === false) || w.focused === false)
          )
        }))

        const filterNewdata = newData.filter((window) => window.tabs.length > 0)

        if (filterNewdata.length == 0) {
          openMessage(
            'success',
            <span>
              <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Woot!</div>
              <div style={{ textAlign: 'left', fontFamily: 'Regular' }}>No open tabs to stash</div>
            </span>,
            <AiOutlineMinusCircle color="#FFD60A" size={24} />
          )
          return
        }

        const newDataStashWindow = [
          { stash: filterNewdata, time: `${time}`, uniqueId: new Date().getTime().toString() },
          ...dataStashWindow
        ]

        dispatch(setCurrentDataStashWindow({ stashWindow: newDataStashWindow }))

        storeStashPage(newDataStashWindow)

        openMessage(
          'success',
          <span>
            <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Stashed!</div>
            <div style={{ textAlign: 'left', fontFamily: 'Regular' }}>
              {numberFormatter(tab.length - 1, 1)} {tab.length - 1 > 1 ? 'tabs ' : 'tab'} across{' '}
              {numberFormatter(window.length, 1)} {window.length > 1 ? 'windows' : 'window'} saved
            </div>
          </span>,
          <AiOutlineMinusCircle color="#FFD60A" size={24} />
        )

        if (window.length > 0) {
          window.map((w) => {
            if (!w.focused && w.id) {
              chrome.windows.remove(w.id)
            }
          })
        }

        if (tab.length > 0)
          tab.map((t) => {
            if (!t.active && t.active === false && t.id) {
              chrome.tabs.remove(t.id)
            }
          })
      })
    })
  }

  useEffect(() => {
    getData('storeStashPage').then((res) => {
      if (res) {
        dispatch(setCurrentDataStashWindow({ stashWindow: res }))
      }
    })
  }, [])

  useEffect(() => {
    if (!dataStashWindow || dataStashWindow.length == 0) {
      setOpenActionTop(false)
    }
  }, [dataStashWindow])

  return (
    <div className="stash-group position-relative" ref={ref}>
      <button
        className={`stash-button tabs-button-box-shadow h-100 hover py-2 px-4 
          ${disabled ? 'disable' : ''} ${
            !steps.every((step) => step.isActive) ? '--hover-disable' : ''
          }`}
        onClick={(e) => {
          e.stopPropagation()
          if (!steps.every((step) => step.isActive)) return
          setOpen(!open)
          setStateBox(EStateBox.LIST)
        }}
        disabled={disabled}
      >
        Tabs
      </button>
      {open && (
        <div className="position-absolute fade-in mt-3" ref={boxRef}>
          <div
            className={`box-stash background-box pt-4 px-4 position-relative ${
              openActionTop ? '--active' : ''
            }`}
          >
            {stateBox === EStateBox.LIST ? (
              <div className="fade-in">
                <div
                  className="header-stash mb-2 d-flex justify-content-between position-relative"
                  style={{ zIndex: 1 }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <img src={Tabs} width={60} height={44} />
                    <div>Tabs Stash</div>
                  </div>
                  <button
                    className={`three-dots-button d-flex align-items-center justify-content-center hover ${
                      !dataStashWindow || dataStashWindow.length === 0 ? 'disable' : ''
                    }`}
                    disabled={!dataStashWindow || dataStashWindow.length ? false : true}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (dataStashWindow.length > 0) setOpenActionTop(!openActionTop)
                    }}
                  >
                    <BsThreeDots size={24} />
                  </button>
                </div>
                <div
                  className={`action-top position-relative ${openActionTop ? '--active' : ''}`}
                  style={{ zIndex: 0 }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2 py-4">
                    <button
                      className="stash-button text-center hover px-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!steps.every((step) => step.isActive)) return
                        getLink()
                      }}
                    >
                      Stash tabs
                    </button>
                    <button
                      className="restore-button text-center hover px-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!steps.every((step) => step.isActive)) return
                        restoreLastSession()
                      }}
                    >
                      Restore last
                    </button>
                  </div>
                  <div className="border-bottom opacity-50" />
                </div>

                <div
                  className={`content-stash hidden-scroll-bar ${openActionTop ? '--active' : ''}`}
                >
                  {dataStashWindow.length === 0 ? (
                    <div style={{ paddingLeft: 55, paddingRight: 55, height: 270 }}>
                      <div className="d-flex flex-column align-items-center justify-content-center h-100">
                        <div className="text-center">
                          Tab-nap: Clear your view now, click back into chaos later!
                        </div>
                        <button
                          className={`stash-button hover px-3 mt-2 ${
                            !steps.every((step) => step.isActive) ? '--hover-disable' : ''
                          }`}
                          onClick={getLink}
                        >
                          Stash open tabs
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 list-stash-box">
                      <ListStash setStateBox={() => setStateBox(EStateBox.DETAIL)} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <StashDetail setStateBox={() => setStateBox(EStateBox.LIST)} />
            )}
          </div>
        </div>
      )}
      {stashSelected && (
        <ConfirmModal
          title={'Permanently delete?'}
          subTitle={`Are you want to delete stash ${stashSelected.time}?`}
          type="delete"
          cancelAction={() => {
            dispatch(popModal())
          }}
          confirmAction={() => {
            dispatch(popModal())
            deleteStashWindow()
            setStateBox(EStateBox.LIST)
          }}
        />
      )}
    </div>
  )
}

export default StashButton
