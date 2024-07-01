import React from 'react'
import { Publication } from '../../../Domain/Model/Publication'
import Media from './Media'
import DetectedContent from './DetectedContent'
import SocialCardColLeft from './FarcasterCardColLeft'
import SocialInfo from './FarcasterInfo'

type Props = {
  post?: Publication
}

function CardQuoted({ post }: Props) {
  if (!post) return null

  const postRender = post.__typename === 'Mirror' ? post.parentPost : post

  if (!postRender) return null
  const shouldShowPostMeta = postRender.metadata_ && postRender.media

  return (
    <div className="ctn-card-quoted">
      <div className="row gx-3">
        <div className="col-auto">
          <SocialCardColLeft post={post} />
        </div>
        <div className="col-9 flex-fill pt-4">
          <SocialInfo post={post} />
          <DetectedContent content={postRender.content || ''} />
          {shouldShowPostMeta && (
            <div>
              <Media metas={postRender.metadata_} media={postRender.media} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardQuoted
