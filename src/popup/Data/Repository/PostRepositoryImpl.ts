import { GraphQLResponse, WalletConnectResponse } from "../../Domain/Model";
import {
  CreatePostInput,
  PostResponse,
  Proposal,
  Publication,
} from "../../Domain/Model/Publication";
import { PostRepository } from "../../Domain/Repository/PostRepository";
import { PostDataSource } from "../DataSource/DataSource";
import { UserDataSource } from "../DataSource/UserDataSource";

export class PostRepositoryImpl implements PostRepository {
  private postDataSource: PostDataSource;
  private userDataSource: UserDataSource;

  constructor(_postDataSource: PostDataSource, _userDataSource: UserDataSource) {
    this.postDataSource = _postDataSource;
    this.userDataSource = _userDataSource;
  }
  createComment(postId: string, content: string, title: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.postDataSource.createComment(postId, content, title)
  }
  getPostComments(postId: string, cursor: string | null): Promise<GraphQLResponse<Publication>> {
    return this.postDataSource.getPostComments(postId, cursor);
  }

  mirror(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.postDataSource.mirror(postId);
  }

  collect(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.userDataSource.collect(postId);
  }

  getPoll(snapshotId: string): Promise<GraphQLResponse<Proposal>> {
    return this.postDataSource.getPoll(snapshotId);
  }

  removeReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.postDataSource.removeReaction(postId);
  }

  addReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.postDataSource.addReaction(postId);
  }

  getPost(postId: string): Promise<GraphQLResponse<Publication>> {
    const postIdFomatted = `lens-${postId}`;
    return this.postDataSource.getPost(postIdFomatted);
  }

  getPosts(query: string): Promise<GraphQLResponse<PostResponse>> {
    return this.postDataSource.getPosts(query);
  }

  createPost(data: CreatePostInput): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.postDataSource.createPost(data);
  }
}
