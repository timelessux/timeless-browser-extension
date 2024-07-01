import React, { useEffect, useState } from 'react'
import { BsDot, BsThreeDots } from 'react-icons/bs'
import { Popover } from 'antd'
import { MdModeEdit } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { pushModal } from '../../redux/slices/modal/modal.slice'
import { EModals } from '../../../../ts'
import { storeStashPage } from '../../../../utils/chromeStorage'
import { usePageLoading } from '../../context/LoadingContext'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import { StashWindow, setStashSelected, updateStash } from '../../redux/slices/stash/stash.slice'
import TabCount from './TabCount'
import WindowCount from './WindowCount'

type Props = {
  stashWindow: StashWindow
  setStateBox: () => void
}

const StashItem = ({ stashWindow, setStateBox }: Props) => {
  const [openEditTool, setOpenEditTool] = useState<boolean>(false)
  const [name, setName] = useState<string>(stashWindow.time)
  const [openEditName, setOpenEditName] = useState<boolean>(false)
  const [vaidateName, setValidateName] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const dataStashWindow = useAppSelector((state) => state.stash.dataStashWindow)
  const { openMessage } = usePageLoading()
  const [typeError, setTypeError] = useState<string>('')

  const openConfirmModal = () => {
    dispatch(pushModal({ name: EModals.CONFIRM_MODAL }))
  }

  const listTabs = stashWindow.stash.flatMap((innerArray) => innerArray.tabs.map((obj) => obj))

  const handleRestore = (session: StashWindow) => {
    session.stash.map((window) => {
      chrome.windows.create({
        focused: window.focused,
        height: window.height,
        incognito: window.incognito,
        url: listTabs.filter((tab) => tab.windowId === window.id).map((m) => m.url) as string[],
        width: window.width
      })
    })
  }

  const handleSaveName = () => {
    const nameTrim = name.trim()
    if (nameTrim.length === 0) {
      setTypeError('Please enter title')
      return
    }
    setTypeError('')

    dispatch(updateStash({ stashWindow: { ...stashWindow, time: nameTrim } }))

    openMessage(
      'success',
      <span>
        <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Stashed Changed!</div>
        <div style={{ textAlign: 'left', fontFamily: 'Regular', wordBreak: 'break-word' }}>
          Stash from {stashWindow?.time} to {name}
        </div>
      </span>,
      <AiOutlineMinusCircle color="#FFD60A" size={24} />
    )

    const currentData = [...dataStashWindow]
    const findIndex = currentData.findIndex((data) => data.uniqueId === stashWindow.uniqueId)

    if (findIndex !== -1) {
      currentData[findIndex] = { ...stashWindow, time: name }
    }

    storeStashPage(currentData)
  }

  useEffect(() => {
    if (name.trim().length === 0) {
      setValidateName(false)
      setTypeError('Please enter name')
    } else {
      setValidateName(true)
      setTypeError('')
    }
  }, [name])

  const chooseStash = () => {
    dispatch(setStashSelected({ stashWindow }))
  }

  return (
    <div
      className="stash-item box-grey p-3 position-relative"
      onMouseLeave={() => {
        setOpenEditTool(false)
      }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="info" style={{ maxWidth: 170 }}>
          {typeError && (
            <div className="text-danger" style={{ wordBreak: 'break-word' }}>
              {typeError}
            </div>
          )}
          {openEditName ? (
            <textarea
              placeholder="Enter name"
              className={`text-area-custom p-2 hover w-100 ${vaidateName ? '' : '--error'}`}
              value={name}
              rows={2}
              autoFocus
              onChange={(e) => {
                setName(e.target.value)
              }}
              onKeyDown={(e) => {
                if (!vaidateName) return
                if (e.code === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  setOpenEditName(false)
                  handleSaveName()
                }
              }}
              onBlur={() => {
                if (!vaidateName) return
                handleSaveName()
                setOpenEditName(false)
              }}
            />
          ) : (
            <div
              className="name cursor-pointer truncate-2"
              onClick={() => {
                chooseStash(), setStateBox()
              }}
            >
              {name}
            </div>
          )}
          <div
            className="d-flex align-items-center opacity-50 description cursor-pointer"
            onClick={() => {
              chooseStash(), setStateBox()
            }}
          >
            <TabCount session={stashWindow} />
            <BsDot />
            <WindowCount session={stashWindow} />
          </div>
        </div>
        <div className="action d-flex align-items-center gap-2">
          <button
            className="restore-button text-center hover px-3"
            onClick={(e) => {
              e.stopPropagation()
              handleRestore(stashWindow)
            }}
          >
            Restore
          </button>
          <Popover
            onOpenChange={() => {
              setOpenEditTool(false)
            }}
            content={
              <div
                onMouseLeave={() => {
                  setOpenEditTool(false)
                }}
                className="p-2"
              >
                <div
                  className="cursor-pointer hover px-2 py-1 rounded"
                  onClick={() => {
                    setOpenEditName(true)
                    setOpenEditTool(false)
                  }}
                >
                  <MdModeEdit /> <span className="align-middle">Rename</span>
                </div>
                <div
                  className="cursor-pointer hover px-2 py-1 rounded"
                  onClick={() => {
                    openConfirmModal()
                    dispatch(setStashSelected({ stashWindow }))
                    setOpenEditTool(false)
                  }}
                >
                  <RiDeleteBin6Fill /> <span className="align-middle">Delete</span>
                </div>
              </div>
            }
            trigger={'click'}
            placement="right"
            open={openEditTool}
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                setOpenEditTool(!openEditTool)
              }}
            >
              <BsThreeDots className="cursor-pointer" />
            </div>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default StashItem
