import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { CgArrowsExpandLeft } from 'react-icons/cg'
import { GoShare } from 'react-icons/go'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { TwitterShareButton } from 'react-share'
import { EPage } from '../../../../../ts'
import { storeListNFTLocalId } from '../../../../../utils/chromeStorage'
import { MyChain, getChain } from '../../../../../utils/mapChains'
import { cutAddress } from '../../../../../utils/textConvert'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import {
  handleChangeCollapse,
  handleChangeIndexToken,
  setCollectionSellected,
  setListLocalNFTId,
  setNFTSellected
} from '../../../redux/slices/token/token.slice'
import Avatar from '../../component/Avatar'
import HeartButton from '../../component/HeartButton'
import { ImageMeta } from '../../component/Image'
import { Loader } from '../../component/Loader'
import { useCollectionViewModel } from '../CollectionViewModel'
import Invalid from '../components/Invalid'
import { NftMetas } from '../components/NftMetas'

type Props = { setPage: React.Dispatch<React.SetStateAction<EPage>>; isVisible?: boolean }

const CollectionDetail = ({ setPage, isVisible }: Props) => {
  const dispatch = useAppDispatch()
  const { collectionSellected, nftSellected, listLocalNFTId } = useAppSelector(
    (state) => state.token
  )

  const collectionDetail = collectionSellected?.collectionDetails

  const { getNftsByWallets, loading } = useCollectionViewModel()

  const [infoChain, setInfoChain] = useState<MyChain>()
  const [loadingInfoChain, setLoadingInfoChain] = useState<boolean>(false)
  const wallet = useAppSelector((state) => state.wallet.wallet)

  const isCollapse = useAppSelector((state) => state.token.isCollapse)

  useEffect(() => {
    if (!wallet) return

    if (collectionSellected) {
      getNftsByWallets({
        collectionIds: collectionSellected.collectionId,
        walletAddresses: wallet.account.address,
        cursor: null,
        isLoadMore: false,
        limit: 25
      })
    }
  }, [collectionSellected])

  const getInfoChain = async () => {
    setLoadingInfoChain(true)
    const res = await getChain(Number(nftSellected?.chainId))
    setLoadingInfoChain(false)
    setInfoChain(res)
  }

  useEffect(() => {
    if (nftSellected) getInfoChain()
  }, [nftSellected])

  if (loading)
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        <Loader />
      </div>
    )

  if (!collectionSellected || !nftSellected) {
    return null
  }

  return (
    <div className={`collection-detail fade-in h-100 ${isVisible && isVisible ? '' : 'd-none'}`}>
      <div className={`row h-100 ${isCollapse ? 'gx-0' : 'gx-4'}`}>
        <div
          className={`left-column h-100 ${
            isCollapse ? 'col-12 --collapse' : 'col-6'
          } position-relative`}
        >
          <CollectionDetailLeftColumnCollapse setPage={setPage} />
          <CollectionDetailViewLeftColumnExpanded />
        </div>
        {!isCollapse && (
          <div className="col-6 right-column">
            <div className="header-collection d-flex justify-content-between">
              <div className="d-flex gap-4">
                <button
                  className="hover back-button"
                  onClick={() => {
                    dispatch(handleChangeCollapse({ isCollapse: false }))
                    setPage(EPage.COLLECTION)
                    dispatch(setNFTSellected({ nft: null }))
                    dispatch(setCollectionSellected({ collection: null }))
                  }}
                >
                  <MdKeyboardArrowLeft color="#fff" size={24} />
                </button>
              </div>
              <div className="d-flex gap-4">
                <HeartButton
                  onClick={async () => {
                    const alreadyStoreLocal = listLocalNFTId.some((e) => e === nftSellected.tokenId)
                    const newLocalNFTListId = alreadyStoreLocal
                      ? listLocalNFTId.filter((e) => e !== nftSellected.tokenId)
                      : [...listLocalNFTId, nftSellected.tokenId as string]

                    await storeListNFTLocalId(newLocalNFTListId)
                    dispatch(setListLocalNFTId(newLocalNFTListId))
                  }}
                  initialState={listLocalNFTId.some((e) => e === nftSellected.tokenId)}
                />
                <TwitterShareButton
                  title={nftSellected.name}
                  url={`\n${nftSellected.description}`}
                  via="timelesswallet"
                >
                  <div className="shareButton">
                    <GoShare color="#fff" size={24} />
                  </div>
                </TwitterShareButton>
              </div>
            </div>
            <div
              className="body-collection hidden-scroll-bar"
              style={{ maxHeight: 490, overflowY: 'scroll' }}
            >
              <div className="title">{nftSellected.name}</div>
              <div className="description">{nftSellected.description}</div>
              <div className="info">
                <div className="box-grey">
                  <div className="info-item px-4 py-3 d-flex justify-content-between">
                    <div className="flex-fill">Contact address</div>
                    <div className="opacity-50">
                      {cutAddress({ address: nftSellected.contractAddress })}
                    </div>
                  </div>
                  <div className="info-item px-4 py-3 d-flex justify-content-between">
                    <div className="flex-fill">Block chain</div>
                    <div className="d-flex align-items-center gap-2">
                      {loadingInfoChain ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{ fontSize: 24, color: '#fff', height: 30 }}
                              spin
                            />
                          }
                        />
                      ) : (
                        <>
                          <Avatar size={30} radius={'50%'} src={infoChain?.logo} />
                          <span className="opacity-50"> {infoChain?.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="info-item px-4 py-3 d-flex justify-content-between">
                    <div className="flex-fill">Token ID</div>
                    <div className="opacity-50">{nftSellected.tokenId}</div>
                  </div>
                  <div className="info-item px-4 py-3 d-flex justify-content-between">
                    <div className="flex-fill">Token Standard</div>
                    <div className="opacity-50">{nftSellected.contract.name}</div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <a
                  className="open-sea-button box-grey hover d-flex gap-2 align-items-center px-5 py-2"
                  target="_blank"
                  href={`https://opensea.io/assets/${nftSellected.chain}/${nftSellected.contractAddress}/${nftSellected.tokenId}`}
                  rel="noreferrer"
                >
                  <span className="d-flex align-items-center" style={{ height: 16 }}>
                    <BsFillArrowUpRightCircleFill />
                  </span>
                  <span className="ms-2">View on OpenSea</span>
                </a>
              </div>
            </div>
            <div className="footer text-center">
              <a
                target="_blank"
                rel="noreferrer"
                className={!collectionDetail?.externalUrl ? 'linkDisable' : undefined}
                href={collectionDetail?.externalUrl ?? ''}
              >
                Website
              </a>
              {' | '}
              <a
                target="_blank"
                rel="noreferrer"
                className={!collectionDetail?.discordUrl ? 'linkDisable' : undefined}
                href={collectionDetail?.discordUrl ?? ''}
              >
                Discord
              </a>
              {' | '}
              <a
                target="_blank"
                rel="noreferrer"
                className={!collectionDetail?.twitterUsername ? 'linkDisable' : undefined}
                href={`https://twitter.com/${collectionDetail?.twitterUsername}`}
              >
                Twitter
              </a>
              {' | '}
              <a
                target="_blank"
                rel="noreferrer"
                className={!collectionDetail?.mediumUsername ? 'linkDisable' : undefined}
                href={`https://medium.com/${collectionDetail?.mediumUsername}`}
              >
                Medium
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionDetail

const CollectionDetailViewLeftColumnExpanded = () => {
  const dispatch = useAppDispatch()
  const isCollapse = useAppSelector((state) => state.token.isCollapse)
  const { next, nftSellected, isPrev, collectionSellected, isNeedLoadMore, nftList, countNft } =
    useAppSelector((state) => state.token)
  const { getNftsByWallets } = useCollectionViewModel()
  const wallet = useAppSelector((state) => state.wallet.wallet)

  if (!nftSellected || !wallet) return null
  return (
    <div className={`h-100 ${isCollapse ? 'd-none' : 'd-block'}`}>
      <div
        className="h-100 cursor-pointer"
        onClick={() => {
          dispatch(handleChangeCollapse({ isCollapse: !isCollapse }))
        }}
      >
        {nftSellected.imageUrl ? (
          <ImageMeta url={nftSellected.imageUrl} name={nftSellected.name} />
        ) : (
          <Invalid message="No image!" />
        )}
      </div>
      <div className="position-absolute gr-button-change-token">
        <button
          className={`hover next-button ${!isPrev ? 'disable' : ''}`}
          disabled={!isPrev}
          onClick={() => {
            dispatch(handleChangeIndexToken({ nft: nftSellected, type: 'prev' }))
          }}
        >
          <MdKeyboardArrowLeft color="#fff" size={24} />
        </button>
        <button
          className={`hover ms-3 next-button ${nftList.length === countNft ? 'disable' : ''}`}
          disabled={nftList.length === countNft}
          onClick={() => {
            dispatch(handleChangeIndexToken({ nft: nftSellected, type: 'next' }))
            if (next && collectionSellected && isNeedLoadMore) {
              getNftsByWallets({
                collectionIds: collectionSellected.collectionId,
                walletAddresses: wallet.account.address,
                cursor: null,
                isLoadMore: true,
                limit: 10
              })
            }
          }}
        >
          <MdKeyboardArrowRight color="#fff" size={24} />
        </button>
      </div>
    </div>
  )
}

const CollectionDetailLeftColumnCollapse = ({ setPage }: Props) => {
  const dispatch = useAppDispatch()
  const isCollapse = useAppSelector((state) => state.token.isCollapse)
  const { nftSellected, listLocalNFTId } = useAppSelector((state) => state.token)
  if (!nftSellected) return null

  return (
    <div className={`${isCollapse ? 'h-100 d-flex flex-column' : 'd-none'}`}>
      <div className="header-collection-detail-collapse">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
            <button
              className="hover back-button"
              onClick={() => {
                dispatch(setNFTSellected({ nft: null }))
                dispatch(setCollectionSellected({ collection: null }))
                dispatch(handleChangeCollapse({ isCollapse: false }))
                setPage(EPage.COLLECTION)
              }}
            >
              <MdKeyboardArrowLeft color="#fff" size={24} />
            </button>
            <div className="name truncate-1">{nftSellected.name}</div>
          </div>
          <div className="d-flex justify-content-center" style={{ flex: 1 }}>
            <button
              className="hover collapse-button d-flex align-items-center justify-content-center gap-2"
              onClick={() => {
                dispatch(handleChangeCollapse({ isCollapse: !isCollapse }))
              }}
              style={{ borderRadius: 22, width: 125 }}
            >
              <CgArrowsExpandLeft color="#fff" size={18} />
              <span>Expanded</span>
            </button>
          </div>
          <div className="d-flex gap-4 justify-content-end" style={{ flex: 1 }}>
            <HeartButton
              onClick={async () => {
                const alreadyStoreLocal = listLocalNFTId.some((e) => e === nftSellected.tokenId)
                const newLocalNFTListId = alreadyStoreLocal
                  ? listLocalNFTId.filter((e) => e !== nftSellected.tokenId)
                  : [...listLocalNFTId, nftSellected.tokenId as string]

                await storeListNFTLocalId(newLocalNFTListId)
                dispatch(setListLocalNFTId(newLocalNFTListId))
              }}
              initialState={listLocalNFTId.some((e) => e === nftSellected.tokenId)}
            />
            <TwitterShareButton
              title={nftSellected.name}
              url={`\n${nftSellected.description}`}
              via="timelesswallet"
            >
              <div className="shareButton">
                <GoShare color="#fff" size={24} />
              </div>
            </TwitterShareButton>
          </div>
        </div>
      </div>
      <div className="boby-collection-detail-collapse" style={{ flex: 1, overflow: 'auto' }}>
        <NftMetas cardData={nftSellected} onlyImage={false} />
      </div>
    </div>
  )
}
