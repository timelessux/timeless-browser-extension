import React, { memo, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getStoreItems } from '../../../../services/explore'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { TExploreItem, exploreActions } from '../../redux/slices/explore/exploreSlice'
import useModalHandler from '../hook/useModalHandler'
import ExploreItem from './components/ExploreItem'
import ReviewExploreItemModal from './components/ReviewExploreItemModal'
import { getData } from '../../../../utils/chromeStorage'

type ExploreItemListingProps = {
  onClickRemix?: () => void
  onClickIPDetails?: () => void
  onClickIPTree?: () => void
}

const ExploreItemListing = (props: ExploreItemListingProps) => {
  const { onClickRemix, onClickIPDetails, onClickIPTree } = props
  const dispatch = useAppDispatch()
  const { listExploreItem } = useAppSelector((state) => state.exploreState)

  const exploreContainerRef = useRef<HTMLDivElement>(null)
  const reviewModalHandler = useModalHandler<TExploreItem>()

  const _initData = async () => {
    const listLocalBookmark: string[] | undefined = await getData('listExploreItemBookmarkedId')
    const listExploreItem = await getStoreItems()

    if (listLocalBookmark?.length) {
      return dispatch(
        exploreActions.setListExploreItem(
          listExploreItem.map((e) => ({
            ...e,
            isBookmark: listLocalBookmark.some((localId) => e.id === localId)
          }))
        )
      )
    }
    dispatch(exploreActions.setListExploreItem(listExploreItem))
  }

  useEffect(() => {
    _initData()
  }, [])

  return (
    <div className="exploreItemContainer" ref={exploreContainerRef}>
      <InfiniteScroll
        dataLength={3}
        className="hidden-scroll-bar infiniteScrollContainer"
        next={() => null}
        hasMore={true}
        loader={null}
        style={{ overflowX: 'hidden', paddingBottom: 16 }}
      >
        <div className="row gy-4">
          {listExploreItem.map((e, i) => {
            return (
              <div className="col-4" key={i}>
                <ExploreItem
                  data={e}
                  onClick={(activeTab?: string) => reviewModalHandler.show(e, activeTab)}
                  onClickRemix={onClickRemix}
                  onClickIPDetails={onClickIPDetails}
                  onClickIPTree={onClickIPTree}
                />
              </div>
            )
          })}
        </div>
      </InfiniteScroll>
      <ReviewExploreItemModal modalHandler={reviewModalHandler} onClickRemix={onClickRemix} />
    </div>
  )
}

export default memo(ExploreItemListing)
