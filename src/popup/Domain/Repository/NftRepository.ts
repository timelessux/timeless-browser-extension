import { GraphQLResponse } from '../Model'
import { CollectionResponse, NFTByCollectResponse, NFTResponse } from '../Model/Token'
export interface NftRepository {
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
