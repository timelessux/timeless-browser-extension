import React, { useEffect } from 'react'
import { BsDot } from 'react-icons/bs'
import { reformatToValidLink } from '../../../../../utils/link'
import { formatPostContent } from '../../../../../utils/textConvert'
import { Publication } from '../../../Domain/Model/Publication'
import Avatar from '../../component/Avatar'
import { useFarcasterViewModel } from '../FarcasterViewModel'
import CardQuoted from './CardQuoted'
import DetectedContent from './DetectedContent'
import Media from './Media'
import MirrorInfor from './MirrorInfo'
import CollectReaction from './Reaction/CollectReaction'
import LikeReaction from './Reaction/LikeReaction'
import MirrorReaction from './Reaction/MirrorReaction'
import FarcasterInfo from './FarcasterInfo'
import TotalLike from './TotalLike'
import TotalReply from './TotalReply'
import VoteInformation from './VoteInfomation'

type Props = {
  post: Publication
  disabled: boolean
}

const ReplyCard = ({ post, disabled }: Props) => {
  const postRender = post.__typename === 'Mirror' ? post.parentPost : post
  if (!postRender) return null

  const { post: quoted, getPoll, loadingPost: loadingQuoted, poll } = useFarcasterViewModel()
  const { snapshotId } = formatPostContent(postRender.content || '')

  const shouldShowQuoted = !loadingQuoted && quoted
  const shouldShowVote = snapshotId && poll

  useEffect(() => {
    if (snapshotId) {
      getPoll(snapshotId)
    }
  }, [])

  return (
    <div className={`social-card p-1 ${post.id === 'loading' && 'opacity-50'}`}>
      <div className="row gx-3">
        <div className="col-auto">
          <div className="d-flex flex-column justify-content-between gap-1 pt-4 row-image">
            <Avatar
              size={48}
              radius={'50%'}
              src={reformatToValidLink(post.profile?.avatar)}
              alt={post.profile?.handle}
            />
          </div>
        </div>
        <div className="col-9 flex-fill">
          <div className="social-content h-100 pt-4 d-flex flex-column justify-content-between">
            {post.__typename === 'Mirror' && <MirrorInfor authorHandle={post.authorHandle || ''} />}
            <div className="col-8">
              <div className="d-flex justify-content-between">
                <div className="content-social w-100">
                  <FarcasterInfo post={postRender} />
                  {postRender.content && (
                    <div className="caption">
                      <DetectedContent content={postRender.content || ''} />
                      {shouldShowQuoted && <CardQuoted post={quoted} />}
                      {shouldShowVote && <VoteInformation voteData={poll} />}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {postRender.media && (
              <div className="col-8 mt-3">
                <Media metas={postRender.metadata_!} media={postRender.media} />
              </div>
            )}
            <div>
              <div className="col-8 mt-3 mb-3">
                <div className="reaction">
                  <div className="d-flex gap-4">
                    <MirrorReaction
                      mirrorCount={postRender.mirrorCount || 0}
                      isMirroredByMe={postRender.isMirroredByMe || false}
                      disabled={disabled}
                      postId={post.id}
                    />
                    <LikeReaction
                      likeCount={postRender.likeCount || 0}
                      isReactedByMe={postRender.isReactedByMe || false}
                      postId={post.id}
                      disabled={disabled}
                    />
                    <CollectReaction
                      collectCount={postRender.collectCount || 0}
                      isCollectedByMe={postRender.isCollectedByMe || false}
                      disabled={disabled}
                      postId={post.id}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-1 d-flex align-items-center gap-1 footer-social-card">
                <TotalReply replyCount={postRender.commentCount || 0} />
                <BsDot />
                <TotalLike likeCount={postRender.likeCount || 0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReplyCard
