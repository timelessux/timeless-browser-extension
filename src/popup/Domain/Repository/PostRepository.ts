import { GraphQLResponse, WalletConnectResponse } from "../Model";
import { CreatePostInput, PostResponse, Proposal, Publication } from "../Model/Publication";

export interface MidjourneyPostResponse {
  status: string;
  fail_reason: string;
  publication_id: string;
}

export interface PostRepository {
  createPost(data: CreatePostInput): Promise<GraphQLResponse<WalletConnectResponse>>
  getPosts(query: string): Promise<GraphQLResponse<PostResponse>>
  getPost(postId: string): Promise<GraphQLResponse<Publication>>
  addReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  removeReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getPoll(snapshotId: string): Promise<GraphQLResponse<Proposal>>
  collect(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  mirror(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getPostComments(postId: string, cursor: string): Promise<GraphQLResponse<Publication>>
  createComment(postId: string, content: string, title: string): Promise<GraphQLResponse<WalletConnectResponse>>
}
