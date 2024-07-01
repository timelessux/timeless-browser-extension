import React, { useEffect } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { EPage } from '../../../../ts'
import { capitalizeTitle } from '../../../../utils/textConvert'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { articleActions, selectArticleState } from '../../redux/slices/articles/articleSlice'
import { getListArticleThunk } from '../../redux/slices/articles/articleThunk'
import { setPage } from '../../redux/slices/pages/pageSlice'
import ButtonWithIcon from '../component/ButtonWithIcon'
import { Loader } from '../component/Loader'
import ArticleCard from '../explore/components/ArticleCard'
import CarouselWrapper from '../explore/components/CarouselWrapper'

type CollectionViewWithTrendingMintProps = {
  isVisible: boolean
  isViewBalance: boolean
  loadingTotal?: boolean
  isFilter: boolean
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>
  setIsViewBalance: React.Dispatch<React.SetStateAction<boolean>>
  total: string
}

export const CollectionViewWithTrendingMint = (props: CollectionViewWithTrendingMintProps) => {
  const { isViewBalance, isVisible, loadingTotal, setIsViewBalance, total } = props
  const { trendingMints, mint } = useAppSelector(selectArticleState)
  const { wallet } = useAppSelector((state) => state.wallet)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (wallet?.account.address) dispatch(getListArticleThunk(wallet?.account.address))
  }, [wallet?.account.address])

  return (
    <div
      className={`collection-page px-5 h-100 ${isVisible ? '' : 'd-none'}`}
      style={{ flex: 1, maxWidth: '100%' }}
    >
      <div
        className="h-100 hidden-scroll-bar fade-in py-4"
        style={{ overflow: 'scroll', maxHeight: 628 }}
        id="collection-page"
      >
        <div className="balance px-5">
          <div className="title opacity-50">TOTAL BALANCE</div>
          <div className="d-flex align-items-center position-relative gap-2">
            <div className={`total ${isViewBalance ? '--visible' : '--hidden'}`}>${total}</div>
            <div
              className={`total d-flex align-items-center position-absolute left-0 ${
                isViewBalance ? '--hidden' : '--visible'
              }`}
            >
              {(total || '0').split('').map((data, index) => (
                <div key={data + index}>
                  <div
                    style={{
                      transform: 'translateY(6.5px)'
                    }}
                  >
                    *
                  </div>
                </div>
              ))}
            </div>
            <ButtonWithIcon
              icon={isViewBalance ? <BsEyeSlash size={24} /> : <BsEye size={24} />}
              visibleTitle={false}
              className="hover eye"
              onClick={() => {
                setIsViewBalance(!isViewBalance)
              }}
            />
            {loadingTotal && <Loader size="small" />}
          </div>
          {/* {currentPrice && percent && (
              <div className={`status ${Number(percent) >= 0 ? '--success' : '--error'}`}>
                ${currentPrice} ({percent}%)
              </div>
            )} */}
        </div>
        <div className="nft-text mt-4 d-flex align-items-center justify-content-between px-5">
          <div>NFT</div>
        </div>
        <div className="px-5 no-collection mt-2">No collection yet!</div>
        <div className="px-5">
          <div className="border-bottom my-4" style={{ opacity: 0.1 }} />
        </div>

        <div className="sectionContainer">
          <div className="sectionHeader">
            <div className="headerLeft px-5">
              <span className="sectionTitle">{capitalizeTitle(trendingMints?.title ?? '')}</span>
              <span className="sectionDescription">{trendingMints?.description}</span>
            </div>
            <span
              className="viewAllButton"
              style={{ opacity: 0.6 }}
              onClick={() => {
                mint &&
                  dispatch(
                    articleActions.setArticleType({
                      key: 'mint',
                      title: mint?.title,
                      description: mint?.description
                    })
                  )
                dispatch(setPage({ page: EPage.ARTICLE_LISTING_BY_TYPE }))
              }}
            >
              Show all
            </span>
          </div>
          <CarouselWrapper
            slidesToShow={5}
            slidesToScroll={5}
            dataLength={trendingMints?.transactions.length ?? 0}
          >
            {trendingMints?.transactions.map((e, i) => {
              return (
                <div key={i} className="carouselItemWrapper">
                  <ArticleCard
                    data={e}
                    key={i}
                    className="carouselItem"
                    onClick={() => dispatch(setPage({ page: EPage.ARTICLE_DETAIL }))}
                  />
                </div>
              )
            })}
          </CarouselWrapper>
        </div>
      </div>
    </div>
  )
}
