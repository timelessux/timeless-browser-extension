import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EPage } from '../../../../ts'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { setCollectionSellected } from '../../redux/slices/token/token.slice'
import StatusComponent from '../component/StatusComponent'
import { useCollectionViewModel } from './CollectionViewModel'
import CollectionItem, { CollectionSkeleton } from './components/CollectionItem'

type Props = { setPage: React.Dispatch<React.SetStateAction<EPage>> }

const ListCollection = ({ setPage }: Props) => {
  const { loadingCollection, getCollections } = useCollectionViewModel()
  const { collections, nextCollection, errorCollection } = useAppSelector((state) => state.token)
  const wallet = useAppSelector((state) => state.wallet.wallet)
  const dispatch = useAppDispatch()

  return (
    <div className="list-nft mt-4">
      <StatusComponent
        loading={loadingCollection}
        loadingComponent={<LoadingCollectionComponent />}
        empty={!loadingCollection && collections.length === 0}
      >
        <InfiniteScroll
          dataLength={collections.length ?? 0}
          className="hidden-scroll-bar"
          next={() => {
            if (wallet) {
              getCollections({
                walletAddress: wallet.account.address,
                cursor: nextCollection,
                isLoadMore: true,
                isFilterAZ: false
              })
            }
          }}
          hasMore={(nextCollection ?? null) !== null && !errorCollection}
          loader={
            <div className="d-flex justify-content-center mt-2">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />} />
            </div>
          }
          scrollableTarget="collection-page"
          style={{ overflow: 'visible' }}
        >
          <div className="row gx-4 gy-4">
            {collections.map((collection) => (
              <div
                className="collection-item col-6 col-lg-4 col-xl-3 cursor-pointer"
                onClick={() => {
                  setPage(EPage.COLLECTION_DETAIL)
                  dispatch(setCollectionSellected({ collection }))
                }}
                key={collection.collectionId}
              >
                <CollectionItem collection={collection} />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </StatusComponent>
    </div>
  )
}

export default ListCollection

const LoadingCollectionComponent = () => {
  return (
    <div className="row gx-4 gy-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div className="collection-item col-6 col-lg-4 col-xl-3" key={item}>
          <CollectionSkeleton />
        </div>
      ))}
    </div>
  )
}
