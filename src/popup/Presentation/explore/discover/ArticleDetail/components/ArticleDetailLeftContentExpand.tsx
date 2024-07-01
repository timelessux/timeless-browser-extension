import React, { memo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook'
import {
  articleActions,
  selectArticleState
} from '../../../../../redux/slices/articles/articleSlice'
import { ImageLoader } from '../../../components/ImageLoader'

const ArticleDetailLeftContentExpandView = memo(() => {
  const { articleDetail, isCollapse } = useAppSelector(selectArticleState)
  const dispatch = useAppDispatch()

  return (
    <div
      className={`leftContent position-relative cursor-pointer overflow-hidden
         ${isCollapse ? 'd-none' : 'd-block'}`}
      onClick={() => {
        dispatch(articleActions.setIsCollapse(true))
      }}
    >
      <div
        className="thumbnailWrapper"
        style={{ backgroundImage: `url(${articleDetail?.ability.imageUrl})` }}
      />
      <ImageLoader url={articleDetail?.ability.imageUrl ?? ''} className="thumbnail" />

      {/* <div className="position-absolute gr-button">
        <button
          className="hover me-2 next-button"
          style={{ border: 'none' }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MdKeyboardArrowLeft color="#fff" size={24} />
        </button>
        <button
          className="hover next-button"
          style={{ border: 'none' }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MdKeyboardArrowRight color="#fff" size={24} />
        </button>
      </div> */}
    </div>
  )
})

export default ArticleDetailLeftContentExpandView
