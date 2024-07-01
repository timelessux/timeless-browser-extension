import { Avatar } from 'antd'
import React, { useEffect, useState } from 'react'
import { EModals } from '../../../../../ts'
import { getData } from '../../../../../utils/chromeStorage'
import { reformatToValidLink } from '../../../../../utils/link'
import avt1 from '../../../assets/icons/avt1.png'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { pushModal } from '../../../redux/slices/modal/modal.slice'
import { setExpanded } from '../../../redux/slices/social-post/social-post.slice'

type Props = {
  disabled: boolean
}

function SocialStatus({ disabled }: Props) {
  const [avatar, setAvatar] = useState<string>()
  const [isLoadLocalData, setIsLoadLocalData] = useState(false)
  const isExpanded = useAppSelector((state) => state.socialPost.isExpanded)

  const dispatch = useAppDispatch()

  const handleGetLocalData = async () => {
    setIsLoadLocalData(true)
    try {
      const localData = await getData('lensProfile')
      if (localData) setAvatar(reformatToValidLink(localData.avatar))
    } catch (error) {
      throw new Error(error)
    } finally {
      setIsLoadLocalData(false)
    }
  }

  useEffect(() => {
    handleGetLocalData()
  }, [])

  const openPostModal = () => {
    dispatch(pushModal({ name: EModals.POST_MODAL }))
  }

  return (
    <div className="social-status w-100 pb-3">
      <div className="d-flex align-items-center gap-3">
        <div
          className="cursor-pointer"
          onClick={() => dispatch(setExpanded({ isExpanded: !isExpanded }))}
        >
          {isLoadLocalData && <div className="avatar-author-skeleton skeleton-loader" />}
          {!isLoadLocalData && <Avatar size={52} src={avatar ?? avt1} />}
        </div>
        <div className="py-2 px-3 social-input d-flex align-items-center justify-content-between">
          <div className={`${disabled ? '' : 'cursor-pointer'} text w-100`} onClick={openPostModal}>
            What&apos;s happening?
          </div>
          <button
            className="px-4 py-2 hover post-button"
            disabled={disabled}
            onClick={openPostModal}
          >
            {'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialStatus
