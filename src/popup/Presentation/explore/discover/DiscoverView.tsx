import React, { useCallback, useEffect, useState } from 'react'
import { TArticle } from '../../../../../ts/articleState'
import { ARTICLE_DISPLAY_VIEW } from '../../../constants/article'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { articleActions, selectArticleState } from '../../../redux/slices/articles/articleSlice'
import ArticleListingByType from './ArticleListingByType'
import ArticleListingView from './ArticleListingView'
import ArticleDetailView from './ArticleDetailView'

const DiscoverView = () => {
  const _dispatch = useAppDispatch()
  const { currentView, previousView } = useAppSelector(selectArticleState)

  const [isDisplay, setIsDisplay] = useState<ARTICLE_DISPLAY_VIEW>(
    ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING
  )

  const _goBack = useCallback(() => {
    switch (currentView) {
      case ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE:
        return setIsDisplay(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING)

      case ARTICLE_DISPLAY_VIEW.ARTICLE_DETAIL:
        if (previousView === ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE)
          return setIsDisplay(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE)
        if (previousView === ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING)
          return setIsDisplay(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING)
    }
  }, [currentView, previousView])

  const _goToDetailArticle = useCallback(() => {
    setIsDisplay(ARTICLE_DISPLAY_VIEW.ARTICLE_DETAIL)
  }, [])

  const _goToArticleListingBySection = useCallback((article: Omit<TArticle, 'transactions'>) => {
    _dispatch(articleActions.setArticleType(article))
    setIsDisplay(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE)
  }, [])

  useEffect(() => {
    if (currentView === ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING)
      setIsDisplay(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING)
  }, [currentView])

  return (
    <div className={`explore-page col-10 w-100 h-100 fade-in`}>
      {isDisplay === ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING && (
        <ArticleListingView
          goToDetail={_goToDetailArticle}
          onClickViewAll={_goToArticleListingBySection}
        />
      )}
      {isDisplay === ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING_BY_TYPE && (
        <ArticleListingByType goBack={_goBack} goToDetail={_goToDetailArticle} />
      )}
      {isDisplay === ARTICLE_DISPLAY_VIEW.ARTICLE_DETAIL && <ArticleDetailView goBack={_goBack} />}
    </div>
  )
}

export default DiscoverView
