import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Publication } from "../../../Domain/Model/Publication";
import { PostCardSkeleton } from "../../component/PostCardSkeleton";
import StatusComponent from "../../component/StatusComponent";
import { useSocialViewModel } from "../SocialViewModel";
import CommentCard from "./CommentCard";
import { CommentInput } from "./CommentInput";
import { EStatusReact } from "../../../../../ts";

type Props = {
  parentPost: Publication;
  setParentPost: React.Dispatch<React.SetStateAction<Publication | undefined>>
};

const loadingComponent = (
  <div>
    <PostCardSkeleton />
    <PostCardSkeleton />
    <PostCardSkeleton />
    <PostCardSkeleton />
  </div>
);

const ListComment = ({ parentPost, setParentPost }: Props) => {
  const { createComment, getPostComments, comments, loadingComment, errorComment, nextCursorComment } =
    useSocialViewModel();

  useEffect(() => {
    if (parentPost.id)
      getPostComments({ postId: parentPost.id, cursor: null, isFetchMore: false });
  }, []);

  if (!comments || !parentPost) return null;

  const onClickComment = async (content: string, title: string) => {
    const status = await createComment(parentPost.id, content, title)
    if (status === EStatusReact.DONE) {
      document.querySelector(".text-area-custom")!.textContent = ""
      const postClone = { ...parentPost }
      if (postClone.commentCount)
        postClone.commentCount = postClone.commentCount + 1
      else postClone.commentCount = 1
      setParentPost(postClone)
    }
  }

  return (
    <div className="list-social">
      <StatusComponent
        loading={loadingComment}
        loadingComponent={loadingComponent}
        error={errorComment || !comments}
      >
        <CommentInput onClick={onClickComment} />
        <InfiniteScroll
          dataLength={comments.length ?? 0}
          className="hidden-scroll-bar"
          next={() => {
            getPostComments({
              postId: parentPost.id,
              cursor: nextCursorComment,
              isFetchMore: true,
            });
          }}
          hasMore={(nextCursorComment ?? null) !== null}
          loader={
            <div className="mb-4 mt-4">
              <PostCardSkeleton />
            </div>
          }
          scrollableTarget="window-platter-content"
          style={{ overflowX: "hidden" }}
        >
          {comments?.map((cmt) => {
            return <CommentCard key={cmt.id} post={cmt} disabled={false} />;
          })}
        </InfiniteScroll>
      </StatusComponent>
    </div>
  );
};

export default ListComment;
