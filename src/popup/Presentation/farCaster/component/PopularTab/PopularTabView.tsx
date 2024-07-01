import React, { useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostCardSkeleton } from '../../../component/PostCardSkeleton'
import StatusComponent from '../../../component/StatusComponent'
import Farcaster from '../FarcasterCard'
import { PopularTabViewController } from './PopularTabViewController'
import { Publication } from '../../../../Domain/Model/Publication'

type PopularTabViewProps = {
  setSelectedPost: React.Dispatch<React.SetStateAction<Publication | undefined>>
}

const PopularTabView = (props: PopularTabViewProps) => {
  const { setSelectedPost } = props

  const { lensProfile, popularPosts, errorGetPopularPosts, onGetListPopularPost } =
    PopularTabViewController()

  const popularTabContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onGetListPopularPost()
  }, [])

  return (
    <div
      ref={popularTabContainer}
      className="h-100 hidden-scroll-bar"
      id="popular-tab-container"
      style={{ overflow: 'auto' }}
    >
      <StatusComponent
        loading={!popularPosts.cursor}
        loadingComponent={
          <div>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        }
        empty={popularPosts.data.length === 0}
        error={errorGetPopularPosts || !popularPosts.data}
      >
        <InfiniteScroll
          dataLength={popularPosts.data.length}
          className="hidden-scroll-bar"
          next={onGetListPopularPost}
          hasMore={!!popularPosts.cursor}
          loader={
            <div className="mb-4 mt-4">
              <PostCardSkeleton />
            </div>
          }
          scrollableTarget="popular-tab-container"
          style={{ overflowX: 'hidden' }}
        >
          {popularPosts.data.map((post) => (
            <Farcaster
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

export default PopularTabView
