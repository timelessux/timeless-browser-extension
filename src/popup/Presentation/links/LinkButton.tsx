import React, { useEffect, useRef, useState } from 'react'
import { EModals } from '../../../../ts'
import { TLink } from '../../../../ts/types'
import { getData } from '../../../../utils/chromeStorage'
//@ts-ignore
import LinkImg from '../../assets/images/link.png'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { pushModal } from '../../redux/slices/modal/modal.slice'
import { setComponent } from '../../redux/slices/tutorial/tutorial.slice'
import CreateLink from './CreateLink'
import EmptyLink from './EmptyLink'

const enum EStateBox {
  CREATE = 'create',
  LIST = 'list'
}

type Props = {
  disabled: boolean
}

const LinkButton = ({ disabled }: Props) => {
  const [stateBox, setStateBox] = useState<EStateBox>(EStateBox.LIST)
  const [links, setLinks] = useState<TLink[]>([])
  const [linkSelected, setLinkSelected] = useState<TLink | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(0)
  const isLock = useAppSelector((state) => state.wallet.isLock)
  const dispatch = useAppDispatch()
  const steps = useAppSelector((state) => state.tutorial.steps)

  const modalStack = useAppSelector((state) => state.modal.modalStack)
  const isOpen = modalStack.find((modal) => modal.name === EModals.CONFIRM_MODAL) !== undefined

  const ref = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const { stepSellected } = useAppSelector((state) => state.tutorial)

  const handleCloseLinkModal = () => {
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
          customLeft: 0,
          customRight: 0,
          topText: 0
        })
      )
    }
  }, [ref, open])

  useEffect(() => {
    if (isLock) {
      setOpen(false)
    }
  }, [isLock])

  useEffect(() => {
    if (stepSellected && stepSellected.id === 'links') return

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleCloseLinkModal()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, stepSellected])

  useEffect(() => {
    getData('links').then((res) => {
      if (res) {
        setLinks(res)
      }
    })
  }, [stateBox, open])

  useEffect(() => {
    if (!open) {
      setLinkSelected(null)
      setStateBox(EStateBox.LIST)
    }
  }, [open])

  useEffect(() => {
    if (stepSellected && stepSellected.action.length > 0) {
      if (stepSellected.action.includes('openLinkBox')) setOpen(true)
      if (stepSellected.action.includes('openStashBox')) setOpen(false)
    }
  }, [stepSellected])

  const onCLickUseButton = (link: TLink) => {
    const listUrl = link.links
    listUrl.map((url) => {
      window.open(url)
    })
  }

  return (
    <div className="links-group position-relative" ref={ref}>
      <button
        className={`link-button links-button-box-shadow h-100 hover py-2 px-4 
          ${disabled ? 'disable' : ''} ${
            !steps.every((step) => step.isActive) ? '--hover-disable' : ''
          }`}
        onClick={(e) => {
          e.stopPropagation()
          if (!steps.every((step) => step.isActive)) return
          setOpen(!open)
          setLinkSelected(null)
        }}
        disabled={disabled}
      >
        Links
      </button>
      {open && (
        <div className="position-absolute fade-in mt-3" ref={boxRef}>
          <div className="box-links background-box pt-4 px-4">
            {stateBox === EStateBox.LIST && (
              <>
                <div className="header-box-link mb-2 d-flex justify-content-between">
                  <div className="d-flex gap-2 align-items-center">
                    <img
                      src={LinkImg}
                      alt=""
                      width={60}
                      height={44}
                      style={{ minWidth: 60, minHeight: 44, maxHeight: 44, maxWidth: 60 }}
                    />
                    <span>Links</span>
                  </div>
                  <button
                    className={`create-link d-flex align-items-center justify-content-center hover ${
                      !steps.every((step) => step.isActive) ? '--hover-disable' : ''
                    }`}
                    onClick={() => {
                      if (!steps.every((step) => step.isActive)) return
                      setStateBox(EStateBox.CREATE)
                      setLinkSelected(null)
                    }}
                  >
                    <span className="mb-1">+</span>
                  </button>
                </div>
                <div className="content-links hidden-scroll-bar">
                  <div style={{ height: 276 }}>
                    {links.length === 0 ? (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <EmptyLink
                          setStateBox={() => {
                            if (!steps.every((step) => step.isActive)) return
                            setStateBox(EStateBox.CREATE)
                            setLinkSelected(null)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3 mt-3 px-2">
                        {links.map((link, index) => {
                          return (
                            <div
                              className="link-item box-grey d-flex align-items-center justify-content-between px-3 py-2 hover cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!steps.every((step) => step.isActive)) return
                                setLinkSelected(link)
                                setStateBox(EStateBox.CREATE)
                                setIndex(index)
                              }}
                              key={`${link.title}` + index}
                            >
                              <div className="title truncate-2 me-1">{link.title}</div>
                              <div className="d-flex gap-2">
                                <button
                                  className={`use-button text-center ${
                                    link.isPublic ? 'opacity-50 cursor-default' : 'hover'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!link.isPublic)
                                      dispatch(
                                        pushModal({
                                          name: EModals.CREATE_EXPLORE_MODAL,
                                          data: JSON.stringify({ link, links, index })
                                        })
                                      )
                                  }}
                                >
                                  Publish
                                </button>
                                <button
                                  className="use-button text-center hover"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onCLickUseButton(link)
                                  }}
                                >
                                  Use
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {stateBox === EStateBox.CREATE && (
              <CreateLink
                link={linkSelected}
                setStateBox={() => {
                  if (!steps.every((step) => step.isActive)) return
                  setStateBox(EStateBox.LIST)
                }}
                links={links}
                index={index}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkButton
