import React, { memo, useEffect, useLayoutEffect } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { capitalizeTitle } from '../../../../../utils/textConvert'
import { ARTICLE_DISPLAY_VIEW } from '../../../constants/article'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { articleActions, selectArticleState } from '../../../redux/slices/articles/articleSlice'
import { getListArticleByTypeThunk } from '../../../redux/slices/articles/articleThunk'
import { setVisibleHeader } from '../../../redux/slices/slide/slide.slice'
import { Loader } from '../../component/Loader'
import ArticleCard from '../components/ArticleCard'
import QuestsCard from '../components/QuestsCard'
import SpindlCard from '../components/SpindlCard'

type ArticleListingByTypeProps = {
  goBack: () => void
  goToDetail?: () => void
}

const ArticleListingByType = memo((props: ArticleListingByTypeProps) => {
  const { goBack, goToDetail } = props

  const _dispatch = useAppDispatch()
  const { wallet } = useAppSelector((state) => state.wallet)
  const { listArticleByType, articleType, fetchingListArticleByType, trendingDApp } =
    useAppSelector(selectArticleState)

  useEffect(() => {
    if (wallet?.account.address && articleType?.key && articleType.key !== 'trending-d-app') {
      _dispatch(
        getListArticleByTypeThunk({ address: wallet.account.address, type: articleType?.key })
      )
    }
  }, [articleType?.key, wallet?.account.address])

  useLayoutEffect(() => {
    _dispatch(setVisibleHeader({ isVisibleHeader: false }))
    _dispatch(articleActions.setCurrentView(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE))
    return () => {
      _dispatch(setVisibleHeader({ isVisibleHeader: true }))
      _dispatch(articleActions.setPreviousView(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE))
    }
  }, [])

  return (
    <div className="articleBySectionContainer ">
      <div className="articleBySectionHeader">
        <button className="hover goBackButton" style={{ border: 'none' }} onClick={goBack}>
          <MdKeyboardArrowLeft color="#fff" size={24} />
        </button>
        <div className="d-flex flex-column">
          <span className="sectionTitle">{capitalizeTitle(articleType?.title ?? '')}</span>
          <span className="sectionDescription">{articleType?.description}</span>
        </div>
      </div>

      {fetchingListArticleByType && (
        <div className="w-100 d-flex align-items-center justify-content-center" style={{ flex: 1 }}>
          <Loader size="large" />
        </div>
      )}

      {!fetchingListArticleByType && (
        <div className="articlesWrapper hidden-scroll-bar fade-in">
          {articleType?.key === 'trending-d-app' &&
            trendingDApp?.map((e) => {
              return <SpindlCard key={e.id} data={e} className="cursor-pointer articleItem" />
            })}
          {articleType?.key === 'quest' &&
            listArticleByType?.map((e, i) => {
              return <QuestsCard key={i} data={e} onClick={goToDetail} />
            })}

          {articleType?.key === 'mint' &&
            listArticleByType?.map((e, i) => {
              return (
                <ArticleCard
                  data={e}
                  key={i}
                  onClick={goToDetail}
                  className="cursor-pointer articleItem"
                />
              )
            })}
        </div>
      )}
    </div>
  )
})

export default ArticleListingByType
