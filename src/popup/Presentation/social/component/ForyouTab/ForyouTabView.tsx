import React, { useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostCardSkeleton } from '../../../component/PostCardSkeleton'
import StatusComponent from '../../../component/StatusComponent'
import SocialCard from '../SocialCard'
import { ForyouTabViewController } from './ForyouTabViewController'
import { Publication } from '../../../../Domain/Model/Publication'

type ForyouTabViewProps = {
  setSelectedPost: React.Dispatch<React.SetStateAction<Publication | undefined>>
}

const ForyouTabView = (props: ForyouTabViewProps) => {
  const { setSelectedPost } = props

  const { lensProfile, foryouPosts, errorGetForyouPosts, onGetListForyouPost } =
    ForyouTabViewController()

  const foryouTabContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onGetListForyouPost()
  }, [])

  return (
    <div
      ref={foryouTabContainer}
      className="h-100 hidden-scroll-bar"
      id="foryou-tab-container"
      style={{ overflow: 'auto' }}
    >
      <StatusComponent
        loading={!foryouPosts.cursor}
        loadingComponent={
          <div>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        }
        empty={foryouPosts.data.length === 0}
        error={errorGetForyouPosts || !foryouPosts}
      >
        <InfiniteScroll
          dataLength={foryouPosts.data.length}
          className="hidden-scroll-bar"
          next={onGetListForyouPost}
          hasMore={!!foryouPosts.cursor}
          loader={
            <div className="mb-4 mt-4">
              <PostCardSkeleton />
            </div>
          }
          scrollableTarget="foryou-tab-container"
          style={{ overflowX: 'hidden' }}
        >
          {foryouPosts.data.map((post) => (
            <SocialCard
              key={post.id}
              post={post}
              disabled={false}
              setSelectedPost={setSelectedPost}
              lensId={lensProfile?.id || null}
            />
          ))}
        </InfiniteScroll>
      </StatusComponent>
    </div>
  )
}

export default ForyouTabView
