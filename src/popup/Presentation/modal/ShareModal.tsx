import React, { useState } from 'react'
import { EModals } from '../../../../ts'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { popModal } from '../../redux/slices/modal/modal.slice'
import { ModalBase } from './ModalBase'
import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  FacebookIcon,
  EmailIcon
} from 'react-share'
import { usePageLoading } from '../../context/LoadingContext'
import { IoCheckmarkSharp, IoCopyOutline } from 'react-icons/io5'

const linkShare = 'https://staging-timeless-social.web.app/post'

const ShareModal = () => {
  const dispatch = useAppDispatch()
  const { openMessage, destroyMessage } = usePageLoading()
  const [isCopied, setIsCopied] = useState<boolean>(false)

  let data
  const dataShare = useAppSelector((state) => state.modal.lastModal?.data)
  if (dataShare) data = JSON.parse(dataShare)

  if (!data) return null
  const link = `${linkShare}/${data.postId}`

  return (
    <ModalBase
      modalName={EModals.SHARE_MODAL}
      onCloseModal={() => {
        dispatch(popModal())
        setIsCopied(false)
      }}
      className="share-modal background-box p-3"
    >
      <div className="title border-bottom pb-3">Share modal</div>
      <div className="py-3 sub-title">Share this link via</div>
      <div className="w-100 group-button-share hidden-scroll-bar d-flex justify-content-between flex-wrap">
        <TwitterShareButton url={`${link}`} via="timelesswallet">
          <TwitterIcon className="cursor-pointer" />
          <div className="blur-color w-100 h-100 position-absolute" />
        </TwitterShareButton>
        <TelegramShareButton url={`${link}`}>
          <TelegramIcon className="cursor-pointer" />
          <div className="blur-color w-100 h-100 position-absolute" />
        </TelegramShareButton>
        <RedditShareButton url={`${link}`}>
          <RedditIcon className="cursor-pointer" />
          <div className="blur-color w-100 h-100 position-absolute" />
        </RedditShareButton>
        <FacebookShareButton url={`${link}`}>
          <FacebookIcon className="cursor-pointer" />
          <div className="blur-color w-100 h-100 position-absolute" />
        </FacebookShareButton>
        <EmailShareButton url={`${link}`}>
          <EmailIcon className="cursor-pointer" />
          <div className="blur-color w-100 h-100 position-absolute" />
        </EmailShareButton>
      </div>
      <div className="py-3 sub-title">Or copy link</div>
      <div className="box-grey px-3 py-2 copy-link hover cursor-pointer">
        <div
          className="d-flex align-items-center justify-content-between gap-2"
          onClick={() => {
            destroyMessage()
            openMessage('success', 'Copy success!')
            setIsCopied(true)
            navigator.clipboard.writeText(link)
          }}
        >
          <span className="truncate-1 align-middle">{link}</span>
          <span
            style={{ width: 14, height: 14 }}
            className="d-flex align-items-center justify-content-center"
          >
            {isCopied ? <IoCheckmarkSharp color="#7CFC00" /> : <IoCopyOutline />}
          </span>
        </div>
      </div>
    </ModalBase>
  )
}

export default ShareModal
