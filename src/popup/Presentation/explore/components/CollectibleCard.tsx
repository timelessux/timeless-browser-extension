import React from 'react'
import { useAppDispatch } from '../../../redux/hook'
import { articleActions } from '../../../redux/slices/articles/articleSlice'
import { TArticleTransaction } from './../../../../../ts/articleState'
import { formatDay } from './../../../../../utils/date'
import { ImageLoader } from './ImageLoader'

type CollectibleCardProps = {
  data: TArticleTransaction
  onClick?: () => void
}

const CollectibleCard = (props: CollectibleCardProps) => {
  const { data, onClick } = props
  const _dispatch = useAppDispatch()

  const _onClick = () => {
    if (onClick) {
      _dispatch(articleActions.setArticleId(data.uid))
      onClick()
    }
  }

  return (
    <div className="collectibleCardContainer" onClick={_onClick}>
      <div onClick={_onClick} className="thumbnailWrapper">
        <ImageLoader url={data.imageUrl} className="thumbnail" />
      </div>
      <div className="contentWrapper">
        <p className="mb-1 day">{formatDay(new Date(data.openAt))}</p>
        <p className="title mb-1">{data.title}</p>
        <p className="description">{data.description}</p>
      </div>
      <div className="divider" />
      <div className="authorWrapper">
        <p>{data.reason.text}</p>
        {/* <Space className="threeDotButton">...</Space> */}
      </div>
    </div>
  )
}

export default CollectibleCard
