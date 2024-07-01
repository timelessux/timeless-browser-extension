import React from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import Avatar from '../component/Avatar'
import { pushModal } from '../../redux/slices/modal/modal.slice'
import { EModals } from '../../../../ts'

type Props = {
  setStateBox: () => void
}

const StashDetai = ({ setStateBox }: Props) => {
  const stashSelected = useAppSelector((state) => state.stash.stashSelected)
  const dispatch = useAppDispatch()
  if (!stashSelected) return null

  const listTabs = stashSelected.stash.flatMap((innerArray) => innerArray.tabs.map((obj) => obj))

  const handleRestore = () => {
    stashSelected.stash.map((window) => {
      chrome.windows.create({
        focused: window.focused,
        height: window.height,
        incognito: window.incognito,
        url: listTabs.filter((tab) => tab.windowId === window.id).map((tab) => tab.url) as string[],
        width: window.width
      })
    })
  }

  return (
    <div className="stash-detail fade-in">
      <div className="header-stash align-items-center mb-2 d-flex gap-2 fade-in">
        <button className="hover back-button" onClick={setStateBox}>
          <MdKeyboardArrowLeft color="#fff" size={24} />
        </button>
        <div>{stashSelected.time}</div>
      </div>
      <div className="action-stash">
        <div className="d-flex align-items-center justify-content-center gap-2 p-3">
          <button
            className="restore-session text-center hover d-flex align-items-center justify-content-center"
            onClick={(e) => {
              e.stopPropagation()
              handleRestore()
            }}
          >
            Restore session
          </button>
          <button
            className="delete-session text-center hover d-flex align-items-center justify-content-center"
            onClick={(e) => {
              e.stopPropagation()
              dispatch(pushModal({ name: EModals.CONFIRM_MODAL }))
            }}
          >
            Delete session
          </button>
        </div>
      </div>
      <div className="hidden-scroll-bar" style={{ maxHeight: 280, overflowY: 'scroll' }}>
        <div className="px-2">
          <div className="name opacity-75" style={{ paddingLeft: 11 }}>
            Tabs
          </div>
          <div className="box-grey mt-1 mb-4">
            <div className="list-tab px-3 pt-1 pb-1">
              {listTabs.map((tab) => (
                <div
                  className="container-tab"
                  key={tab.id}
                  onClick={() => {
                    chrome.tabs.create({
                      url: tab.url
                    })
                  }}
                >
                  <div className="tab my-3 cursor-pointer">
                    <div className="d-flex gap-2 align-items-center">
                      <Avatar size={38} radius={'8px'} src={tab.favIconUrl} />
                      <div className="name truncate-1">{tab.title}</div>
                    </div>
                  </div>
                  <div className="border-bottom opacity-25" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StashDetai
