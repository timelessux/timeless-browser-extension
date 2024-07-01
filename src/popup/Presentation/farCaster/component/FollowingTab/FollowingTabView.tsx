import React, { useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostCardSkeleton } from '../../../component/PostCardSkeleton'
import StatusComponent from '../../../component/StatusComponent'
import SocialCard from '../FarcasterCard'
import { FollowingTabViewController } from './FollowingTabViewController'
import { Publication } from '../../../../Domain/Model/Publication'

type FollowingTabViewProps = {
  setSelectedPost: React.Dispatch<React.SetStateAction<Publication | undefined>>
}

const FollowingTabView = (props: FollowingTabViewProps) => {
  const { setSelectedPost } = props

  const { lensProfile, errorGetFollowingPosts, followingPosts, onGetListFollowingPost } =
    FollowingTabViewController()

  const followingTabContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onGetListFollowingPost()
  }, [])

  return (
    <div
      ref={followingTabContainer}
      className="h-100 hidden-scroll-bar"
      id="following-tab-container"
      style={{ overflow: 'auto' }}
    >
      <StatusComponent
        loading={!followingPosts.cursor}
        loadingComponent={
          <div>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        }
        empty={followingPosts.data.length === 0}
        error={errorGetFollowingPosts || !followingPosts.data}
      >
        <InfiniteScroll
          dataLength={followingPosts.data.length}
          className="hidden-scroll-bar"
          next={onGetListFollowingPost}
          hasMore={!!followingPosts.cursor}
          loader={
            <div className="mb-4 mt-4">
              <PostCardSkeleton />
            </div>
          }
          scrollableTarget="following-tab-container"
          style={{ overflowX: 'hidden' }}
        >
          {followingPosts.data.map((post) => (
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

export default FollowingTabView
