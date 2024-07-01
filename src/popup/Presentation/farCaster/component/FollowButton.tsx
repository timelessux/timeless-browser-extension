import React, { useEffect, useState } from 'react'
import { Profile } from '../../../Domain/Model/Profile'
import { useFarcasterViewModel } from '../FarcasterViewModel'
import { EStatusReact } from '../../../../../ts'
import { usePageLoading } from '../../../context/LoadingContext'
import { PiDotsThreeBold } from 'react-icons/pi'

type Props = {
  profile?: Profile
  disabled: boolean
}

const FollowButton = ({ profile, disabled }: Props) => {
  const { followProfile, unfollowProfile, following } = useFarcasterViewModel()
  const [followed, setFollowed] = useState<boolean>(profile?.isFollowedByMe || false)
  const { openMessage, destroyMessage } = usePageLoading()

  const handleFollow = async () => {
    if (!profile || !profile.id) {
      destroyMessage()
      openMessage('error', 'Error')
      return
    }
    if (following) return

    if (followed) {
      const res = await unfollowProfile(profile.id)
      if (res === EStatusReact.DONE) {
        setFollowed(false)
        destroyMessage()
        openMessage('success', 'Complete')
        setFollowed(!followed)
      } else {
        destroyMessage()
        setFollowed(true)
        openMessage('error', 'Error')
      }
    } else {
      const res = await followProfile(profile.id)
      if (res === EStatusReact.DONE) {
        destroyMessage()
        setFollowed(!followed)
      } else {
        destroyMessage()
        openMessage('error', 'Error')
      }
    }
  }

  useEffect(() => {
    if (following) openMessage('loading', 'Loading...')
  }, [following])

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        className="follow-button px-3 py-2 hover"
        onClick={handleFollow}
        disabled={disabled}
        style={{ minWidth: 52 }}
      >
        {`${followed ? 'Following' : 'Follow'}`}
      </button>
      <PiDotsThreeBold size={25} />
    </div>
  )
}

export default FollowButton
