import { EProvider, ETypeProfile } from '../../../../ts'
import { GraphQLResponse, WalletConnectResponse } from '../../Domain/Model'
import { ChallengeResponse } from '../../Domain/Model/Auth'
import { NotificationResponse } from '../../Domain/Model/Notification'
import { ListProfileResponse, Profile } from '../../Domain/Model/Profile'
import {
  CreatePostInput,
  PostResponse,
  Proposal,
  Publication
} from '../../Domain/Model/Publication'
import { CollectionResponse, NFTByCollectResponse, NFTResponse } from '../../Domain/Model/Token'
import { CommunityTag } from '../../Domain/Repository/CommunityTagRepository'
import { TimelessProfile } from '../../Domain/Repository/InternalProfileRepository'
import { IWallet } from '../../Domain/Repository/SendRepository'
import { Token } from '../../Domain/Repository/UserRepository'
import {
  OnRampResponse,
  QuoteRequest,
  QuoteResponse,
  TokenPriceResponse
} from '../../Domain/Repository/WalletConnectRepository'
import { DailyDataDTO } from './DashboardDataSource'

export interface UserDataSourceInterface {
  login(userName: string, password: string): Promise<Token | null>
  getAuthChalenge(address: string, profileId: string): Promise<GraphQLResponse<ChallengeResponse>>
  authenticateWithLens(signature: string, address: string, authId: string): Promise<Token | null>
  getProfile(address: string): Promise<GraphQLResponse<ListProfileResponse>>
  follow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  unfollow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getProfileByHandles(handle: string): Promise<GraphQLResponse<Array<Profile>>>
  getLeaderboards(
    provider: EProvider,
    type: ETypeProfile
  ): Promise<GraphQLResponse<ListProfileResponse>>
  createChangeProfileManagersTypedData(): Promise<GraphQLResponse<WalletConnectResponse>>
  collect(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
}

export interface InternalProfileDataSource {
  getInternalProfiles(): Promise<Array<TimelessProfile>>
}

export interface CommunityTagDataSource {
  getCommunityTags(): Promise<Array<CommunityTag>>
}

export interface MidjourneyDataSource {
  getMidjourneyData(jobId: string): Promise<object>
}

export interface PostDataSource {
  createPost(data: CreatePostInput): Promise<GraphQLResponse<WalletConnectResponse>>
  getPosts(query: string): Promise<GraphQLResponse<PostResponse>>
  getPost(postId: string): Promise<GraphQLResponse<Publication>>
  addReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  removeReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getPoll(snapshotId: string): Promise<GraphQLResponse<Proposal>>
  mirror(postId: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getPostComments(postId: string, cursor: string | null): Promise<GraphQLResponse<Publication>>
  createComment(
    postId: string,
    content: string,
    title: string
  ): Promise<GraphQLResponse<WalletConnectResponse>>
}

export interface SendDataSource {
  getRecipientAccount({ address }: { address: string }): Promise<IWallet>
}

export interface DashboardDataSource {
  getDailyData(
    installationId: string,
    timeZone: string
  ): Promise<DailyDataDTO['data']['extension']['getDailyData']>
  getMantras(): Array<string>
  getNotification(profileId: string, cursor: string): Promise<NotificationResponse>
}

export interface WalletConnectDatasource {
  request(id: string, params: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getQuote(request: QuoteRequest): Promise<GraphQLResponse<QuoteResponse>>
  getTokenPrice(
    ids: Array<string>,
    vsCurrencies: string
  ): Promise<GraphQLResponse<TokenPriceResponse>>
  signMoonpayUrl(url: string): Promise<GraphQLResponse<OnRampResponse>>
}

export interface FileDataSource {
  upload(file: File): Promise<string>
}

export interface NftDataSource {
  getNft(
    address: string,
    chain: number,
    cursor: string | null
  ): Promise<GraphQLResponse<NFTResponse>>

  getNftsByWallets(
    collectionIds: number | string,
    walletAddresses: string,
    cursor: string | null,
    limit: number
  ): Promise<GraphQLResponse<NFTByCollectResponse>>

  getCollectionsByWallets(
    walletAddresses: string,
    cursor: string | null
  ): Promise<GraphQLResponse<CollectionResponse>>
}
