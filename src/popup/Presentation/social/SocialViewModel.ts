import { useState } from "react";
import BaseService from "../../../../services/axios";
import { EProvider, EStatusReact, ETypePost, ETypeProfile } from "../../../../ts";
import { walletConnectWrapper } from "../../../../utils/function";
import {
  CreatePostInput,
  PostResponse,
  Proposal,
  Publication,
} from "../../Domain/Model/Publication";
import { FileRepository, PostRepository, UserRepository } from "../../Domain/Repository";
import { getData } from "../../../../utils/chromeStorage";
import { usePageLoading } from "../../context/LoadingContext";
import { Profile } from "../../Domain/Model/Profile";
import { useAppDispatch } from "../../redux/hook";
import { setPostCreated } from "../../redux/slices/social-post/social-post.slice";

const axiosClient = new BaseService();

export const useSocialViewModel = () => {
  const [poll, setPoll] = useState<Proposal>();
  const [posts, setPosts] = useState<Array<Publication>>([]);
  const [post, setPost] = useState<Publication>();
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);
  const [followStatus, setFollowStatus] = useState<string>("");
  const [reacting, setReacting] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(false);
  const [collecting, setCollecting] = useState<boolean>(false);
  const [mirroring, setMirroring] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<Publication>>([]);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [errorComment, setErrorComment] = useState<string>();
  const [nextCursorComment, setNextCursorComment] = useState<string | null | undefined>(null);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [listSuggested, setListSeggested] = useState<Profile[]>([]);
  const dispatch = useAppDispatch();
  const { openMessage, destroyMessage } = usePageLoading();

  const fetchPosts = async ({
    type,
    cursor = null,
    isFetchMore = false,
  }: {
    type: ETypePost;
    cursor?: string | null;
    isFetchMore?: boolean;
  }) => {
    let address = null;
    const lensProfile = await getData("lensProfile");
    if (lensProfile) {
      address = lensProfile.ownerAddress;
    }
    !isFetchMore && setLoading(true);
    const query = `
      query MyQuery {
        getNewsFeed(request: {feedAlgorithm: TIMELESS, address: "${address}", cursor: ${
      cursor ? `"${cursor}"` : null
    }, feedType: ${type}, publicationTypes: [POST, MIRROR], limit: 10}) {
          pageMeta {
            nextCursor
          }
          items {
            ... on Post {
              __typename
              id
              collectCount
              dislikeCount
              likeCount
              commentCount
              mirrorCount
              title
              content
              metadata_
              media {
                altTag
                cover
                item
                type
              }
              profile {
                avatar
                id
                name
                handle
                isFollowedByMe
              }
              createdAt
              isCollectedByMe
              isMirroredByMe
              isReactedByMe
              authorHandle
            }

            ... on Mirror {
              __typename
              id
              collectCount
              dislikeCount
              likeCount
              commentCount
              mirrorCount
              title
              content
              metadata_
              media {
                altTag
                cover
                item
                type
              }
              profile {
                avatar
                id
                name
                handle
                isFollowedByMe
              }
              createdAt
              isCollectedByMe
              isMirroredByMe
              isReactedByMe
              authorHandle
              parentPost {
                id
                collectCount
                dislikeCount
                likeCount
                commentCount
                mirrorCount
                title
                content
                metadata_
                media {
                  altTag
                  cover
                  item
                  type
                }
                profile {
                  avatar
                  id
                  name
                  handle
                  isFollowedByMe
                }
                createdAt
                isCollectedByMe
                isMirroredByMe
                isReactedByMe
                authorHandle
              }
            }
          }
        }
      }
    `;

    const res = await PostRepository(axiosClient).getPosts(query);

    if (res.errors) {
      setError(res.errors[0].message);
    }
    if (res.data) {
      setError(undefined);
      const postsResponse: PostResponse = res.data.getNewsFeed;
      if (isFetchMore) {
        setPosts((prev) => [...prev, ...postsResponse.items]);
      } else {
        setPosts(postsResponse.items);
      }
      setNextCursor(postsResponse.pageMeta.nextCursor);
    }
    setLoading(false);
  };

  const followProfile = async (profileId: string) => {
    setFollowing(true);
    const res = await UserRepository(axiosClient).follow(profileId);
    if (res.data) {
      return res.data["follow"].status === EStatusReact.DONE
        ? EStatusReact.DONE
        : EStatusReact.FAILED;
    }
    setFollowing(false);
    return EStatusReact.FAILED;
  };

  const getPost = async (postId: string) => {
    setLoadingPost(true);
    const res = await PostRepository(axiosClient).getPost(postId);
    if (res.data) setPost(res.data.getPublicationById);
    setLoadingPost(false);
  };

  const unfollowProfile = async (profileId: string) => {
    setFollowing(true);
    const res = await UserRepository(axiosClient).unfollow(profileId);
    if (res.data) {
      return res.data["unfollow"].status === EStatusReact.DONE
        ? EStatusReact.DONE
        : EStatusReact.FAILED;
    }
    setFollowing(false);
    return EStatusReact.FAILED;
  };

  const addReaction = async (postId: string) => {
    setReacting(true);
    const res = await walletConnectWrapper(
      PostRepository(axiosClient).addReaction(postId),
      "addReaction"
    );
    if (res.data) {
      setReacting(false);
      return res.data["addReaction"].status === EStatusReact.DONE
        ? EStatusReact.DONE
        : EStatusReact.FAILED;
    }
    setReacting(false);
    return EStatusReact.FAILED;
  };

  const removeReaction = async (postId: string) => {
    setReacting(true);
    const res = await walletConnectWrapper(
      PostRepository(axiosClient).removeReaction(postId),
      "removeReaction"
    );
    if (res.data) {
      setReacting(false);
      return res.data["removeReaction"].status === EStatusReact.DONE
        ? EStatusReact.DONE
        : EStatusReact.FAILED;
    }
    setReacting(false);
    return EStatusReact.FAILED;
  };

  const getPoll = async (snapshotId: string) => {
    const res = await PostRepository(axiosClient).getPoll(snapshotId);
    if (res.data) setPoll(res.data["proposal"]);
  };

  const collect = async (postId: string) => {
    setCollecting(true);
    const res = await PostRepository(axiosClient).collect(postId);
    setCollecting(false);
    return res;
  };

  const mirror = async (postId: string, content: string, title: string) => {
    setMirroring(true);
    const res = await walletConnectWrapper(
      PostRepository(axiosClient).mirror(postId, content, title),
      "mirror"
    );
    setMirroring(false);
    if (res.data) {
      return res.data["mirror"];
    }
  };

  const createPost = async (data: CreatePostInput) => {
    setIsCreatePost(true);
    const res = await walletConnectWrapper(
      PostRepository(axiosClient).createPost(data),
      "createPost"
    );

    setIsCreatePost(false);
    destroyMessage();
    if (res.data) {
      openMessage("success", "Success");
      setTimeout(() => {
        dispatch(setPostCreated({ isPostCreated: true }));
      }, 5000);
      return res.data["createPost"].status;
    }
    openMessage("error", "Something wrong!");
    return EStatusReact.FAILED;
  };

  const getPostComments = async ({
    postId,
    cursor,
    isFetchMore,
  }: {
    postId: string;
    cursor: string | null | undefined;
    isFetchMore: boolean;
  }) => {
    if (!isFetchMore) setLoadingComment(true);
    const res = await PostRepository(axiosClient).getPostComments(postId, cursor);
    setLoadingComment(false);

    if (res.data) {
      const postsResponse: PostResponse = res.data.getPublicationById.comments;

      if (isFetchMore) {
        setComments((prev) => [...prev, ...postsResponse.items]);
      } else {
        setComments(postsResponse.items);
      }
      setNextCursorComment(postsResponse.pageMeta.nextCursor);
      setErrorComment(undefined);
    } else {
      setErrorComment("Error load comment");
      setNextCursorComment(null);
    }
  };

  const upload = async (file) => {
    const res = await FileRepository().upload(file);
    return res;
  };

  const createComment = async (postId: string, content: string, title: string) => {
    openMessage("loading", "Comment creating...");
    const profile = await getData("lensProfile");
    const data: Publication = {
      __typename: "",
      id: "loading",
      content: content,
      title: title,
      profile: profile,
      commentCount: 0,
      authorHandle: profile.handle,
      createdAt: new Date().toISOString(),
    };

    setComments([data, ...comments]);
    const res = await walletConnectWrapper(
      PostRepository(axiosClient).createComment(postId, content, title),
      "createCommentOrQuote"
    );

    destroyMessage();
    if (res.data && res.data["createCommentOrQuote"].status === EStatusReact.DONE) {
      data.id = res.data["createCommentOrQuote"].publicationId ?? "";
      setComments([data, ...comments]);
      destroyMessage();
      openMessage("success", "Success");
      return EStatusReact.DONE;
    } else {
      destroyMessage();
      openMessage("error", "Something wrong");
      return EStatusReact.FAILED;
    }
  };

  async function getLeaderboards() {
    const res = await UserRepository(axiosClient).getLeaderboards(
      EProvider.LENS,
      ETypeProfile.INFLUENCER
    );

    if (res.data) {
      setListSeggested(res.data["getLeaderboard"].profiles);
    }
  }

  return {
    addReaction,
    fetchPosts,
    nextCursor,
    posts,
    error,
    loading,
    followProfile,
    followStatus,
    post,
    getPost,
    loadingPost,
    unfollowProfile,
    removeReaction,
    reacting,
    following,
    getPoll,
    poll,
    collect,
    mirror,
    collecting,
    mirroring,
    createPost,
    getPostComments,
    comments,
    loadingComment,
    errorComment,
    nextCursorComment,
    upload,
    createComment,
    isCreatePost,
    getLeaderboards,
    listSuggested,
    setPosts,
  };
};
