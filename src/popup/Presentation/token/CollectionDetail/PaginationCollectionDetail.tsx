import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { ImageMeta } from '../../component/Image'
import Invalid from '../components/Invalid'
import { NFT } from '../../../Domain/Model/Token'
import { setNFTSellected } from '../../../redux/slices/token/token.slice'
import { useCollectionViewModel } from '../CollectionViewModel'
import { Loader } from '../../component/Loader'

const PaginationCollectionDetail = () => {
  const {
    nftList,
    nftSellected,
    collectionSellected,
    isCollapse: isCollapseTokenDetail,
    next
  } = useAppSelector((state) => state.token)

  const dispatch = useAppDispatch()
  const refs = useRef<Array<HTMLDivElement | null>>([])
  const { getNftsByWallets, loading } = useCollectionViewModel()
  const wallet = useAppSelector((state) => state.wallet.wallet)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClickPagination = (nft: NFT, index: number) => {
    if (typeof index !== 'undefined') {
      refs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
    dispatch(setNFTSellected({ nft }))
  }

  useEffect(() => {
    const findIndex = nftList.findIndex((nft) => nft.contract === nftSellected?.contract)

    if (findIndex >= 0) {
      refs.current[findIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }, [nftSellected])

  useEffect(() => {
    if (!wallet) return
    const handleScroll = () => {
      const container = containerRef.current

      if (container && container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        if (next && collectionSellected) {
          getNftsByWallets({
            collectionIds: collectionSellected.collectionId,
            walletAddresses: wallet.account.address,
            cursor: null,
            isLoadMore: true,
            limit: 10
          })
        }
      }
    }

    const container = containerRef.current

    if (container) {
      container.addEventListener('scroll', handleScroll)

      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  if (!collectionSellected || !nftSellected) return null

  return (
    <div
      className={`pagination-collection-detail hidden-scroll-bar mt-2 ${
        isCollapseTokenDetail ? '' : '--close-pagination'
      }`}
      id="pagination"
      ref={containerRef}
    >
      <div className="d-flex align-items-center gap-2">
        {nftList.map((nft, index) => {
          return (
            <div
              ref={(element) => {
                refs.current[index] = element
              }}
              className={`pagination-image cursor-pointer ${
                nftSellected &&
                nft.contractAddress === nftSellected.contractAddress &&
                nft.tokenId === nftSellected.tokenId
                  ? '--active'
                  : ''
              }`}
              onClick={() => {
                handleClickPagination(nft, index)
              }}
              key={nft.contractAddress + nft.tokenId}
            >
              {nft.imageUrl ? (
                <ImageMeta url={nft.imageUrl} name={nft.name} />
              ) : (
                <Invalid message="No image!" visibleMessage={false} />
              )}
            </div>
          )
        })}
        {loading && (
          <div className="p-2">
            <Loader />
          </div>
        )}
      </div>
    </div>
  )
}
export default PaginationCollectionDetail
