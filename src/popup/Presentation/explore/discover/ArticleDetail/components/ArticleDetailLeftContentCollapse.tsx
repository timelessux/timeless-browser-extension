import React, { memo } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook'
import {
  articleActions,
  selectArticleState
} from '../../../../../redux/slices/articles/articleSlice'
import { ImageLoader } from '../../../components/ImageLoader'
import { CgArrowsExpandLeft } from 'react-icons/cg'
import { TwitterShareButton } from 'react-share'
import { GoShare } from 'react-icons/go'
import { ImageMeta } from '../../../../component/Image'

type ArticleDetailLeftContentProps = {
  goBack: () => void
}

const ArticleDetailLeftContentCollapseView = memo((props: ArticleDetailLeftContentProps) => {
  const { articleDetail, isCollapse } = useAppSelector(selectArticleState)
  const dispatch = useAppDispatch()

  return (
    <div
      className={`leftContent --colapse position-relative p-4 ${isCollapse ? 'd-block' : 'd-none'}`}
    >
      <div className={`${isCollapse ? 'h-100 d-flex flex-column' : 'd-none'}`}>
        <div className="header-article-detail-collapse">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
              <button
                className="hover back-button"
                onClick={() => {
                  props.goBack(), dispatch(articleActions.setIsCollapse(false))
                }}
              >
                <MdKeyboardArrowLeft color="#fff" size={24} />
              </button>
              <div className="name truncate-1">{articleDetail?.ability.title}</div>
            </div>
            <div className="d-flex justify-content-center" style={{ flex: 1 }}>
              <button
                className="hover collapse-button d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  dispatch(articleActions.setIsCollapse(false))
                }}
                style={{ borderRadius: 22, width: 125 }}
              >
                <CgArrowsExpandLeft color="#fff" size={18} />
                <span>Expanded</span>
              </button>
            </div>
            <div className="d-flex gap-4 justify-content-end" style={{ flex: 1 }}>
              <TwitterShareButton
                title={articleDetail?.ability.title}
                url={`\n${articleDetail?.ability.description}`}
                via="timelesswallet"
              >
                <div className="shareButton">
                  <GoShare color="#fff" size={24} />
                </div>
              </TwitterShareButton>
            </div>
          </div>
        </div>
        <div className="boby-article-detail-collapse mt-4" style={{ flex: 1, overflow: 'auto' }}>
          <ImageMeta
            url={articleDetail?.ability.imageUrl || ''}
            name={articleDetail?.ability.title || ''}
            className="thumbnail-colapse"
          />
        </div>
      </div>
    </div>
  )
})

export default ArticleDetailLeftContentCollapseView
