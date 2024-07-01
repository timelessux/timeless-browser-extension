import React, { useEffect, useState } from 'react'
import { EPage } from '../../../../ts'
import { HexString } from '../../../../ts/types'
import { getData } from '../../../../utils/chromeStorage'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { setPage as setPageSlice } from '../../redux/slices/pages/pageSlice'
import { setVisibleMenuSideBar } from '../../redux/slices/slide/slide.slice'
import { setListLocalNFTId } from '../../redux/slices/token/token.slice'
import { getWalletBalanceThunk } from '../../redux/slices/token/tokenThunk'
import ArticleDetailView from '../explore/discover/ArticleDetailView'
import ArticleListingByType from '../explore/discover/ArticleListingByType'
import { useCollectionViewModel } from './CollectionViewModel'
import { CollectionViewWithNFT } from './CollectionViewWithNFT'
import { CollectionViewWithTrendingMint } from './CollectionViewWithTrendingMint'

type Props = {
  setPage: React.Dispatch<React.SetStateAction<EPage>>
  isVisible: boolean
}

const CollectionView = ({ setPage, isVisible }: Props) => {
  const dispatch = useAppDispatch()
  const { getExchangeRate } = useCollectionViewModel()
  const { page, previousPage } = useAppSelector((state) => state.pageSlice)

  const { chain, wallet } = useAppSelector((state) => state.wallet)
  const { walletBalance, fetchingWalletBalance, listToken } = useAppSelector((state) => state.token)
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [isViewBalance, setIsViewBalance] = useState<boolean>(true)
  const [currentPrice, setCurrentPrice] = useState<string>()
  const [percent, setPercent] = useState<string>()
  const { collections } = useAppSelector((state) => state.token)

  const getListNFTLocalId = async () => {
    const listNFTLocalId: string[] | undefined = await getData('listNFTLocalId')
    dispatch(setListLocalNFTId(listNFTLocalId ?? []))
  }

  useEffect(() => {
    if (currentPrice) return
    async function fetchExchangeData() {
      const exchangeRes = await getExchangeRate()
      if (exchangeRes) {
        setCurrentPrice(Number(exchangeRes.usd).toFixed(2))
        setPercent(Number(exchangeRes.usd24hChange).toFixed(2))
      }
    }
    if (chain) fetchExchangeData()
  }, [currentPrice, chain])

  useEffect(() => {
    dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: true }))
    getListNFTLocalId()
  }, [])

  useEffect(() => {
    if (wallet?.account.address) {
      dispatch(
        getWalletBalanceThunk({
          walletAddress: wallet?.account.address as HexString,
          listToken
        })
      )
    }
  }, [wallet, listToken])

  const checkRenderPageTrending = () => {
    switch (page) {
      case EPage.DEFAULT:
        return (
          <CollectionViewWithTrendingMint
            isVisible={isVisible}
            isViewBalance={isViewBalance}
            loadingTotal={fetchingWalletBalance}
            isFilter={isFilter}
            setIsFilter={setIsFilter}
            setIsViewBalance={setIsViewBalance}
            total={walletBalance}
          />
        )

      case EPage.ARTICLE_LISTING_BY_TYPE:
        return (
          <ArticleListingByType
            goBack={() => {
              if (page === EPage.ARTICLE_LISTING_BY_TYPE) {
                dispatch(setPageSlice({ page: EPage.DEFAULT }))
              } else {
                dispatch(setPageSlice({ page: previousPage }))
              }
            }}
            goToDetail={() => {
              dispatch(setPageSlice({ page: EPage.ARTICLE_DETAIL }))
            }}
          />
        )

      case EPage.ARTICLE_DETAIL:
        return (
          <ArticleDetailView
            goBack={() => {
              dispatch(setPageSlice({ page: previousPage }))
            }}
          />
        )

      default:
        return (
          <CollectionViewWithTrendingMint
            isVisible={isVisible}
            isViewBalance={isViewBalance}
            loadingTotal={fetchingWalletBalance}
            isFilter={isFilter}
            setIsFilter={setIsFilter}
            setIsViewBalance={setIsViewBalance}
            total={walletBalance}
          />
        )
    }
  }

  if (!isVisible) return null

  return (
    <>
      {collections.length > 0 ? (
        <CollectionViewWithNFT
          isVisible={isVisible}
          isViewBalance={isViewBalance}
          loadingTotal={fetchingWalletBalance}
          isFilter={isFilter}
          setIsFilter={setIsFilter}
          setIsViewBalance={setIsViewBalance}
          setPage={setPage}
          total={walletBalance}
        />
      ) : (
        checkRenderPageTrending()
      )}
    </>
  )
}

export default CollectionView
