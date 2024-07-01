import { GraphQLResponse } from '../../Domain/Model'
import { CollectionResponse, NFTByCollectResponse, NFTResponse } from '../../Domain/Model/Token'
import { NftRepository } from '../../Domain/Repository/NftRepository'
import { NftDataSource } from '../DataSource/DataSource'

export class NftRepositoryImpl implements NftRepository {
  private ntfDataSource: NftDataSource
  constructor(_ntfDataSource: NftDataSource) {
    this.ntfDataSource = _ntfDataSource
  }

  getNft(
    address: string,
    chain: number,
    cursor: string | null
  ): Promise<GraphQLResponse<NFTResponse>> {
    return this.ntfDataSource.getNft(address, chain, cursor)
  }

  getNftsByWallets(
    collectionIds: number | string,
    walletAddresses: string,
    cursor: string | null,
    limit: number
  ): Promise<GraphQLResponse<NFTByCollectResponse>> {
    return this.ntfDataSource.getNftsByWallets(collectionIds, walletAddresses, cursor, limit)
  }

  getCollectionsByWallets(
    walletAddresses: string,
    cursor: string | null
  ): Promise<GraphQLResponse<CollectionResponse>> {
    return this.ntfDataSource.getCollectionsByWallets(walletAddresses, cursor)
  }
}
