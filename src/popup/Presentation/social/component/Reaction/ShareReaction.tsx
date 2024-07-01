import React from 'react'
import { IoShareOutline } from 'react-icons/io5'
import { EModals } from '../../../../../../ts'
import { useAppDispatch } from '../../../../redux/hook'
import { pushModal } from '../../../../redux/slices/modal/modal.slice'

type Props = {
  postId: string
}

const ShareReaction = ({ postId }: Props) => {
  const dispatch = useAppDispatch()
  const openShareModal = () => {
    dispatch(pushModal({ name: EModals.SHARE_MODAL, data: JSON.stringify({ postId }) }))
  }

  return (
    <div
      className="share-reaction cursor-pointer"
      onClick={(e) => {
        openShareModal(), e.stopPropagation()
      }}
    >
      <span>
        <IoShareOutline size={18} />
      </span>
    </div>
  )
}

export default ShareReaction
