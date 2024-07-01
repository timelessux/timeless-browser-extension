import React, { useEffect } from 'react'
import { BsDot } from 'react-icons/bs'
import { EModals, ETypePost } from '../../../../../ts'
import { formatPostContent } from '../../../../../utils/textConvert'
import { Publication } from '../../../Domain/Model/Publication'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { pushModal } from '../../../redux/slices/modal/modal.slice'
import { useSocialViewModel } from '../SocialViewModel'
import CardQuoted from './CardQuoted'
import DetectedContent from './DetectedContent'
import FollowButton from './FollowButton'
import Media from './Media'
import MirrorInfor from './MirrorInfo'
import BookmarkReaction from './Reaction/BookmarkReaction'
import CollectReaction from './Reaction/CollectReaction'
import CommentReaction from './Reaction/CommentReaction'
import LikeReaction from './Reaction/LikeReaction'
import MirrorReaction from './Reaction/MirrorReaction'
import ShareReaction from './Reaction/ShareReaction'
import ViewReaction from './Reaction/ViewReaction'
import SocialCardColLeft from './SocialCardColLeft'
import SocialInfo from './SocialInfo'
import TotalLike from './TotalLike'
import TotalReply from './TotalReply'
import VoteInformation from './VoteInfomation'

type Props = {
  post: Publication
  disabled: boolean
  setSelectedPost?: React.Dispatch<React.SetStateAction<Publication | undefined>>
  lensId: string | null
}

const SocialCard = ({ post, disabled, lensId }: Props) => {
  const { type } = useAppSelector((state) => state.socialPost)
  const postRender = post.__typename === 'Mirror' ? post.parentPost : post
  if (!postRender) return null

  const { post: quoted, getPoll, loadingPost: loadingQuoted, poll } = useSocialViewModel()
  const { snapshotId } = formatPostContent(postRender.content || '')

  const shouldShowQuoted = !loadingQuoted && quoted
  const shouldShowVote = snapshotId && poll
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (snapshotId) {
      getPoll(snapshotId)
    }
  }, [])

  const handleShowComment = () => {
    dispatch(pushModal({ name: EModals.REPLY_MODAL, data: JSON.stringify(post) }))
  }

  return (
    <div className="social-card p-1">
      <div className="row gx-3">
        <div className="col-auto">
          <SocialCardColLeft post={postRender} />
        </div>
        <div className="col-9 flex-fill">
          <div className="social-content h-100 pt-4 d-flex flex-column justify-content-between">
            {post.__typename === 'Mirror' && <MirrorInfor authorHandle={post.authorHandle || ''} />}
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <div className="content-social w-100">
                  <SocialInfo post={postRender} />
                  {postRender.content && (
                    <div className="caption">
                      <DetectedContent content={postRender.content || ''} />
                      {shouldShowQuoted && <CardQuoted post={quoted} />}
                      {shouldShowVote && <VoteInformation voteData={poll} />}
                    </div>
                  )}
                </div>
                {type !== ETypePost.FOLLOWING && (
                  <div>
                    {postRender.profile && postRender.profile.id !== lensId && (
                      <FollowButton profile={postRender.profile} disabled={disabled} />
                    )}
                  </div>
                )}
              </div>
            </div>
            {postRender.media && postRender.metadata_ && (
              <div className="mt-3">
                <Media metas={postRender.metadata_} media={postRender.media} />
              </div>
            )}
            <div>
              <div className="mt-3 mb-3">
                <div className="reaction">
                  <div className="d-flex justify-content-between">
                    <MirrorReaction
                      mirrorCount={postRender.mirrorCount || 0}
                      isMirroredByMe={postRender.isMirroredByMe || false}
                      disabled={disabled}
                      postId={post.id}
                    />
                    <LikeReaction
                      likeCount={postRender.likeCount || 0}
                      isReactedByMe={postRender.isReactedByMe || false}
                      postId={post.__typename === 'Mirror' ? post.parentPost?.id : post.id}
                      disabled={disabled}
                    />
                    <CommentReaction
                      commentCount={postRender.commentCount || 0}
                      onClick={handleShowComment}
                    />
                    <CollectReaction
                      collectCount={postRender.collectCount || 0}
                      isCollectedByMe={postRender.isCollectedByMe || false}
                      disabled={disabled}
                      postId={post.id}
                    />
                    <ViewReaction viewCount={postRender.likeCount || 0} />
                    <BookmarkReaction />
                    <ShareReaction postId={post.id} />
                  </div>
                </div>
              </div>
              <div className="mb-1 d-flex align-items-center gap-1 footer-social-card">
                <TotalReply replyCount={postRender.commentCount || 0} onClick={handleShowComment} />
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

export default SocialCard
