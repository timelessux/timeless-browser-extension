import React, { useEffect, useState } from "react";
import { PostCardSkeleton } from "../../../../component/PostCardSkeleton";
import { useSocialViewModel } from "../../../SocialViewModel";
import { Profile } from "../../../../../Domain/Model/Profile";
import { getData } from "../../../../../../../utils/chromeStorage";
import { ETypePost } from "../../../../../../../ts";
import StatusComponent from "../../../../component/StatusComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./PostCard";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hook";
import { setPostCreated } from "../../../../../redux/slices/social-post/social-post.slice";

const loadingComponent = (
  <div className="px-3">
    <PostCardSkeleton />
    <PostCardSkeleton />
    <PostCardSkeleton />
    <PostCardSkeleton />
  </div>
);

const ListPost = () => {
  const { fetchPosts, posts, loading, error, nextCursor } = useSocialViewModel();
  const isPostCreated = useAppSelector((state) => state.socialPost.isPostCreated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchPosts({ type: ETypePost.ME });
    if (isPostCreated) {
      dispatch(setPostCreated({ isPostCreated: false }));
    }
  }, [isPostCreated]);

  return (
    <div className="list-post mt-4">
      <StatusComponent
        loading={loading}
        loadingComponent={loadingComponent}
        empty={!loading && posts.length === 0}
        error={error || !posts}
      >
        <InfiniteScroll
          dataLength={posts.length ?? 0}
          className="hidden-scroll-bar"
          next={() => {
            fetchPosts({ type: ETypePost.ME, cursor: nextCursor, isFetchMore: true });
          }}
          hasMore={(nextCursor ?? null) !== null}
          loader={
            <div className="my-4 px-3">
              <PostCardSkeleton />
            </div>
          }
          scrollableTarget="information"
          style={{ overflowX: "hidden" }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </InfiniteScroll>
      </StatusComponent>
    </div>
  );
};

export default ListPost;
