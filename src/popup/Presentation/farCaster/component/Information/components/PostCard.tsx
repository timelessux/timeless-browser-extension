import React, { useEffect } from 'react'
import { BsDot, BsThreeDots } from 'react-icons/bs'
import { PiSealCheckFill } from 'react-icons/pi'
import { EModals } from '../../../../../../../ts'
import { reformatDateFromNow } from '../../../../../../../utils/date'
import { reformatToValidLink } from '../../../../../../../utils/link'
import { formatPostContent } from '../../../../../../../utils/textConvert'
import { Publication } from '../../../../../Domain/Model/Publication'
import { useAppDispatch } from '../../../../../redux/hook'
import { pushModal } from '../../../../../redux/slices/modal/modal.slice'
import Avatar from '../../../../component/Avatar'
import { useSocialViewModel } from '../../../SocialViewModel'
import CardQuoted from '../../CardQuoted'
import DetectedContent from '../../DetectedContent'
import Media from '../../Media'
import MirrorInfor from '../../MirrorInfo'
import CommentReaction from '../../Reaction/CommentReaction'
import LikeReaction from '../../Reaction/LikeReaction'
import MirrorReaction from '../../Reaction/MirrorReaction'
import ShareReaction from '../../Reaction/ShareReaction'
import ViewReaction from '../../Reaction/ViewReaction'
import VoteInformation from '../../VoteInfomation'

type Props = {
  post: Publication
}

const PostCard = ({ post }: Props) => {
  const postRender = post.__typename === 'Mirror' ? post.parentPost : post
  if (!postRender) return null

  const { post: quoted, getPoll, loadingPost: loadingQuoted, poll } = useSocialViewModel()
  const { snapshotId } = formatPostContent(postRender.content || '')

  const shouldShowQuoted = !loadingQuoted && quoted
  const shouldShowVote = snapshotId && poll
  const dispatch = useAppDispatch()

  const handleShowComment = () => {
    dispatch(pushModal({ name: EModals.REPLY_MODAL, data: JSON.stringify(post) }))
  }

  useEffect(() => {
    if (snapshotId) {
      getPoll(snapshotId)
    }
  }, [])

  return (
    <div className="post-card py-3">
      <div className="px-3">
        {post.__typename === 'Mirror' && <MirrorInfor authorHandle={post.authorHandle || ''} />}
      </div>
      <div className="header-post-card d-flex align-items-start justify-content-between px-3">
        <div className="info d-flex align-items-center gap-1">
          <Avatar size={32} radius={'50%'} src={reformatToValidLink(postRender.profile?.avatar)} />
          <div className="d-flex gx-1 flex-wrap" style={{ maxWidth: 150 }}>
            {postRender.profile?.name && (
              <div className="d-flex align-items-center gap-1">
                <div className="name">{postRender.profile?.name}</div>
                <div
                  style={{ minWidth: 16, minHeight: 16, maxHeight: 16, maxWidth: 16 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <PiSealCheckFill size={16} />
                </div>
              </div>
            )}
            <div className="handle">@{postRender.profile?.handle}</div>
          </div>
          <BsDot color="#ffffff5a" />
          {post.updatedAt ||
            (post.createdAt && (
              <span className="time-post">
                {reformatDateFromNow(post.updatedAt || post.createdAt)}
              </span>
            ))}
        </div>
        <div
          style={{ minWidth: 18, minHeight: 18, maxHeight: 18, maxWidth: 18 }}
          className="d-flex align-items-center justify-content-center"
        >
          <BsThreeDots size={18} />
        </div>
      </div>
      <div className="mt-2 px-3">
        {postRender.content && (
          <div className="caption">
            <DetectedContent content={postRender.content || ''} />
            {shouldShowQuoted && <CardQuoted post={quoted} />}
            {shouldShowVote && <VoteInformation voteData={poll} />}
          </div>
        )}
        {postRender.media && postRender.metadata_ && (
          <div className="mt-3">
            <Media metas={postRender.metadata_} media={postRender.media} />
          </div>
        )}
      </div>
      <div className="reaction px-3 mt-3">
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-2">
            <CommentReaction
              commentCount={postRender.commentCount || 0}
              onClick={handleShowComment}
            />
            <MirrorReaction
              mirrorCount={postRender.mirrorCount || 0}
              isMirroredByMe={postRender.isMirroredByMe || false}
              disabled={false}
              postId={post.id}
            />
            <LikeReaction
              likeCount={postRender.likeCount || 0}
              isReactedByMe={postRender.isReactedByMe || false}
              postId={post.__typename === 'Mirror' ? post.parentPost?.id : post.id}
              disabled={false}
            />

            <ViewReaction viewCount={postRender.likeCount || 0} />
          </div>
          <ShareReaction postId={post.id} />
        </div>
      </div>
    </div>
  )
}

export default PostCard
