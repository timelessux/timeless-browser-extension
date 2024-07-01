import React from 'react'
import { TArticleTransaction } from '../../../../../ts/articleState'
import { useAppDispatch } from '../../../redux/hook'
import { articleActions } from '../../../redux/slices/articles/articleSlice'
import { ImageLoader } from './ImageLoader'

type QuestsCardProps = {
  data: TArticleTransaction
  onClick?: () => void
}
const QuestsCard = (props: QuestsCardProps) => {
  const { data, onClick } = props
  const _dispatch = useAppDispatch()

  const _onClick = () => {
    if (onClick) {
      _dispatch(articleActions.setArticleId(data.uid))
      onClick()
    }
  }
  return (
    <div className="questsCardContainer" onClick={_onClick}>
      <div className="thumbnailWrapper">
        <ImageLoader
          url={data.imageUrl}
          className="thumbnailQuestCard"
          skeletonClassName="skeleton"
        />
      </div>
      <div className="titleWrapper">
        <p className="title">{data.title}</p>
        {/* <p className="rewards">{`Earn`}</p> */}
      </div>
      <div className="divider" />
      <div className="d-flex footer">
        {data.reason.imageUrl && (
          <ImageLoader
            url={data.reason.imageUrl}
            className="avatar"
            skeletonClassName="avatar-skeleton"
          />
        )}
        <p className="reasonText">{data.reason.text}</p>
        {/* <Space className="threeDotButton">...</Space> */}
      </div>
    </div>
  )
}

export default QuestsCard
