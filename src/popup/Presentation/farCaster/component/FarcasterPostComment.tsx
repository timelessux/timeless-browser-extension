import React, { useEffect, useState } from 'react'
import FarcasterCard from './FarcasterCard'
import { Publication } from '../../../Domain/Model/Publication'
import ListComment from './ListComment'
import { Profile } from '../../../Domain/Model/Profile'
import { getData } from '../../../../../utils/chromeStorage'

interface Props {
  post: Publication
  setPost: React.Dispatch<React.SetStateAction<Publication | undefined>>
}

function FarcasterPostComment({ post, setPost }: Props) {
  const [profile, setLensProfile] = useState<Profile>()

  useEffect(() => {
    getData('lensProfile').then((res) => setLensProfile(res))
  }, [])

  return (
    <div className="social-view fade-in d-flex flex-column w-100 h-100">
      <FarcasterCard post={post} disabled={false} lensId={profile?.id} />
      <div
        className="social-card p-1"
        style={{
          height: '100%'
        }}
      >
        <ListComment parentPost={post} setParentPost={setPost} />
      </div>
    </div>
  )
}

export default FarcasterPostComment
