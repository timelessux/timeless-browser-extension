import React, { memo } from 'react'
import { TArticleTransaction } from '../../../../../ts/articleState'
import { useAppDispatch } from '../../../redux/hook'
import { articleActions } from '../../../redux/slices/articles/articleSlice'
import { ImageLoader } from './ImageLoader'

type ArticleCardProps = {
  data: TArticleTransaction
  className?: string
  onClick?: () => void
}

const ArticleCard = memo((props: ArticleCardProps) => {
  const { data, className, onClick } = props
  const _dispatch = useAppDispatch()

  const _onClick = () => {
    if (onClick) {
      _dispatch(articleActions.setArticleId(data.uid))
      onClick()
    }
  }

  return (
    <div onClick={_onClick} className={`articleCardContainer ${className}`}>
      <div className="thumbnailWrapper">
        <ImageLoader className="thumbnail" url={data.imageUrl} />
      </div>
      <span className="articleTitle">{data.title}</span>
      <span className="author">{data.reason.text}</span>
      {/* <Space className="threeDotButton">...</Space> */}
    </div>
  )
})

export default ArticleCard
