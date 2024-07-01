import React, { useEffect, useState } from 'react'
import { BsDot } from 'react-icons/bs'
import { reformatToValidLink } from '../../../../../utils/link'
import { formatPostContent } from '../../../../../utils/textConvert'
import { Publication } from '../../../Domain/Model/Publication'
import Avatar from '../../component/Avatar'
import { useFarcasterViewModel } from '../FarcasterViewModel'
import CardQuoted from './CardQuoted'
import DetectedContent from './DetectedContent'
import ListReply from './ListReply'
import CollectReaction from './Reaction/CollectReaction'
import CommentReaction from './Reaction/CommentReaction'
import LikeReaction from './Reaction/LikeReaction'
import MirrorReaction from './Reaction/MirrorReaction'
import FarcasterInfo from './FarcasterInfo'
import TotalLike from './TotalLike'
import TotalReply from './TotalReply'
import VoteInformation from './VoteInfomation'
import { useAppDispatch } from '../../../redux/hook'
import { pushModal } from '../../../redux/slices/modal/modal.slice'
import { EModals } from '../../../../../ts'

type Props = {
  post: Publication
  disabled: boolean
}

const CommentCard = ({ post, disabled }: Props) => {
  const [comment, setComment] = useState<Publication | undefined>(
    post.__typename === 'Mirror' ? post.parentPost : post
  )
  if (!comment) return null

  const { post: quoted, getPoll, loadingPost: loadingQuoted, poll } = useFarcasterViewModel()
  const { snapshotId } = formatPostContent(comment.content || '')

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
    <div className={`social-card p-1 ${comment.id === 'loading' && 'opacity-50'}`}>
      <div className="row gx-3">
        <div className="col-auto">
          <div className="d-flex flex-column justify-content-between gap-1 pt-4 row-image">
            <Avatar
              size={48}
              radius={'50%'}
              src={reformatToValidLink(comment.profile?.avatar)}
              alt={comment.profile?.handle}
            />
          </div>
        </div>
        <div className="col-9 flex-fill">
          <div className="social-content h-100 pt-4 d-flex flex-column justify-content-between">
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <div className="content-social w-100">
                  <FarcasterInfo post={comment} />
                  {comment.content && (
                    <div className="caption">
                      <DetectedContent content={comment.content || ''} />
                      {shouldShowQuoted && <CardQuoted post={quoted} />}
                      {shouldShowVote && <VoteInformation voteData={poll} />}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="col-12 mt-3 mb-3">
                <div className="reaction">
                  <div className="d-flex gap-4">
                    <MirrorReaction
                      mirrorCount={comment.mirrorCount || 0}
                      isMirroredByMe={comment.isMirroredByMe || false}
                      disabled={disabled}
                      postId={comment.id}
                    />
                    <LikeReaction
                      likeCount={comment.likeCount || 0}
                      isReactedByMe={comment.isReactedByMe || false}
                      postId={comment.id}
                      disabled={disabled}
                    />
                    <CommentReaction
                      commentCount={comment.commentCount || 0}
                      onClick={handleShowComment}
                    />
                    <CollectReaction
                      collectCount={comment.collectCount || 0}
                      isCollectedByMe={comment.isCollectedByMe || false}
                      disabled={disabled}
                      postId={comment.id}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-1 d-flex align-items-center gap-1 footer-social-card">
                <TotalReply replyCount={comment.commentCount || 0} onClick={handleShowComment} />
                <BsDot />
                <TotalLike likeCount={comment.likeCount || 0} />
              </div>
              <ListReply parentPost={comment} setParentPost={setComment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentCard
