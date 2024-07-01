import React, { Fragment, memo, useLayoutEffect } from 'react'
import { TArticle } from '../../../../../ts/articleState'
import { capitalizeTitle } from '../../../../../utils/textConvert'
import { Loader } from '../../../Presentation/component/Loader'
import { ARTICLE_DISPLAY_VIEW } from '../../../constants/article'
import { articleActions, selectArticleState } from '../../../redux/slices/articles/articleSlice'
import {
  getListArticleThunk,
  getListSpindlThunk
} from '../../../redux/slices/articles/articleThunk'
import ArticleCard from '../components/ArticleCard'
import CarouselWrapper from '../components/CarouselWrapper'
import CollectibleCard from '../components/CollectibleCard'
import QuestsCard from '../components/QuestsCard'
import SpindlCard from '../components/SpindlCard'
import { useAppDispatch, useAppSelector } from './../../../redux/hook'

type ArticleListingViewProps = {
  goToDetail?: () => void
  onClickViewAll?: (article: Omit<TArticle, 'transactions'>) => void
}

const ArticleListingView = memo((props: ArticleListingViewProps) => {
  const { goToDetail, onClickViewAll } = props
  const _dispatch = useAppDispatch()

  const {
    mint,
    questsForYou,
    articleForYou,
    trendingMints,
    popularCreators,
    trendingInfluencers,
    fetchingListArticle,
    trendingDApp,
    fetchingListSpindl
  } = useAppSelector(selectArticleState)
  const { wallet } = useAppSelector((state) => state.wallet)

  useLayoutEffect(() => {
    _dispatch(articleActions.setCurrentView(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING))
    if (wallet?.account.address) {
      _dispatch(getListArticleThunk(wallet?.account.address))
      _dispatch(getListSpindlThunk({address: wallet.account.address}))
    }
    return () => {
      _dispatch(articleActions.setPreviousView(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING))
    }
  }, [])

  return (
    <div className="articleViewContainer fade-in h-100 px-5 py-2 align-self-center">
      {(fetchingListArticle || fetchingListSpindl) && (
        <div
          className="w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ flex: 1 }}
        >
          <Loader />
        </div>
      )}
      {!fetchingListArticle && !fetchingListSpindl && (
        <Fragment>
          {/* <div className="featuredSection">
            <div className="leftSection">
              <span className="sectionTitle">Featured Today</span>
              <span className="articleTitle">BasePaint Day #298 - Small Brush Showoff I</span>
              <span className="articleDescription">Currently trending onchain</span>
            </div>
            <div className="rightSection">
              <img
                alt="image"
                loading="lazy"
                src="https://images.pexels.com/photos/257599/pexels-photo-257599.jpeg"
              />
            </div>
          </div> */}

          {trendingDApp && (
            <div className="sectionContainer">
              <div className="sectionHeader">
                <div className="headerLeft">
                  <span className="sectionTitle">Trending Dapps</span>
                  <span className="sectionDescription">Spot the gems before they sparkle</span>
                </div>
                <span
                  className="viewAllButton"
                  onClick={() =>
                    onClickViewAll &&
                    onClickViewAll({
                      key: 'trending-d-app',
                      title: 'Trending Dapps',
                      description: 'Spot the gems before they sparkle'
                    })
                  }
                >
                  Show all
                </span>
              </div>
              <CarouselWrapper
                slidesToShow={5}
                slidesToScroll={5}
                dataLength={trendingDApp.length ?? 0}
                nextArrowClassName="carouselArrowIcon"
                prevArrowClassName="carouselArrowIcon"
              >
                {trendingDApp.map((e) => {
                  return (
                    <div key={e.id} className="carouselItemWrapper">
                      <SpindlCard data={e} className="carouselItem" />
                    </div>
                  )
                })}
              </CarouselWrapper>
            </div>
          )}

          <div className="sectionContainer">
            <div className="sectionHeader">
              <div className="headerLeft">
                <span className="sectionTitle">{capitalizeTitle(mint?.title ?? '')}</span>
                <span className="sectionDescription">{mint?.description}</span>
              </div>
              <span
                className="viewAllButton"
                onClick={() =>
                  mint &&
                  onClickViewAll &&
                  onClickViewAll({
                    key: 'mint',
                    title: mint?.title,
                    description: mint?.description
                  })
                }
              >
                Show all
              </span>
            </div>
            <CarouselWrapper
              slidesToShow={5}
              slidesToScroll={5}
              dataLength={mint?.transactions.length ?? 0}
              nextArrowClassName="carouselArrowIcon"
              prevArrowClassName="carouselArrowIcon"
            >
              {mint?.transactions.map((e, i) => {
                return (
                  <div key={i} className="carouselItemWrapper">
                    <ArticleCard data={e} key={i} className="carouselItem" onClick={goToDetail} />
                  </div>
                )
              })}
            </CarouselWrapper>
          </div>

          <div className="sectionContainer">
            <div className="sectionHeader">
              <div className="headerLeft">
                <span className="sectionTitle">{capitalizeTitle(questsForYou?.title ?? '')}</span>
                <span className="sectionDescription">{questsForYou?.description}</span>
              </div>
              <span
                className="viewAllButton"
                onClick={() =>
                  questsForYou &&
                  onClickViewAll &&
                  onClickViewAll({
                    key: 'quest',
                    title: questsForYou?.title,
                    description: questsForYou?.description
                  })
                }
              >
                Show all
              </span>
            </div>
            <CarouselWrapper
              slidesToShow={4}
              slidesToScroll={4}
              dataLength={questsForYou?.transactions.length ?? 0}
            >
              {questsForYou?.transactions.map((article) => {
                return <QuestsCard key={article.uid} data={article} onClick={goToDetail} />
              })}
            </CarouselWrapper>
          </div>

          <div className="sectionContainer">
            <div className="sectionHeader">
              <div className="headerLeft">
                <span className="sectionTitle">{capitalizeTitle(articleForYou?.title ?? '')}</span>
                <span className="sectionDescription">{articleForYou?.description}</span>
              </div>
            </div>
            <CarouselWrapper
              slidesToShow={3}
              slidesToScroll={3}
              dataLength={articleForYou?.transactions.length ?? 0}
            >
              {articleForYou?.transactions.map((article) => {
                return <CollectibleCard key={article.uid} data={article} onClick={goToDetail} />
              })}
            </CarouselWrapper>
          </div>

          <div className="sectionContainer">
            <div className="sectionHeader">
              <div className="headerLeft">
                <span className="sectionTitle">
                  {capitalizeTitle(popularCreators?.title ?? '')}
                </span>
                <span className="sectionDescription">{popularCreators?.description}</span>
              </div>
            </div>
            <CarouselWrapper
              slidesToShow={5}
              slidesToScroll={5}
              dataLength={popularCreators?.transactions.length ?? 0}
              nextArrowClassName="carouselArrowIcon"
              prevArrowClassName="carouselArrowIcon"
            >
              {popularCreators?.transactions.map((e, i) => {
                return (
                  <div key={i} className="carouselItemWrapper">
                    <ArticleCard data={e} key={i} className="carouselItem" onClick={goToDetail} />
                  </div>
                )
              })}
            </CarouselWrapper>
          </div>

          <div className="sectionContainer">
            <div className="sectionHeader">
              <div className="headerLeft">
                <span className="sectionTitle">
                  {capitalizeTitle(trendingInfluencers?.title ?? '')}
                </span>
                <span className="sectionDescription">{trendingInfluencers?.description}</span>
              </div>
            </div>
            <CarouselWrapper
              slidesToShow={5}
              slidesToScroll={5}
              dataLength={trendingInfluencers?.transactions.length ?? 0}
              nextArrowClassName="carouselArrowIcon"
              prevArrowClassName="carouselArrowIcon"
            >
              {trendingInfluencers?.transactions.map((e, i) => {
                return (
                  <div key={i} className="carouselItemWrapper">
                    <ArticleCard data={e} key={i} className="carouselItem" onClick={goToDetail} />
                  </div>
                )
              })}
            </CarouselWrapper>
          </div>

          <div className="sectionContainer">
            <div className="sectionHeader">
              <div className="headerLeft">
                <span className="sectionTitle">{capitalizeTitle(trendingMints?.title ?? '')}</span>
                <span className="sectionDescription">{trendingMints?.description}</span>
              </div>
            </div>
            <CarouselWrapper
              slidesToShow={5}
              slidesToScroll={5}
              dataLength={trendingMints?.transactions.length ?? 0}
              nextArrowClassName="carouselArrowIcon"
              prevArrowClassName="carouselArrowIcon"
            >
              {trendingMints?.transactions.map((e, i) => {
                return (
                  <div key={i} className="carouselItemWrapper">
                    <ArticleCard data={e} key={i} className="carouselItem" onClick={goToDetail} />
                  </div>
                )
              })}
            </CarouselWrapper>
          </div>
        </Fragment>
      )}
    </div>
  )
})

export default ArticleListingView
