import { customChains } from '../../../../utils/mapChains'
import { GraphQLResponse } from '../../Domain/Model'
import { CollectionResponse, NFTByCollectResponse, NFTResponse } from '../../Domain/Model/Token'
import { NftDataSource } from './DataSource'

const { VITE_AA_API_KEY, VITE_AA_WALLET_API } = import.meta.env
export class NftDataSourceImpl implements NftDataSource {
  async getNft(
    address: string,
    chain: number,
    cursor: string | null
  ): Promise<GraphQLResponse<NFTResponse>> {
    const query = `
      query getNftByWallet {
        nft {
          getNftsByWallets(request: {chainIds: [${chain}], walletAddresses: ["${address}"], limit: 25, cursor: ${
            cursor ? `"${cursor}"` : null
          }} ) {
            count
            next
            items {
              name
              nftId
              contractAddress
              chain
              chainId
              audioUrl
              videoUrl
              tokenId
              otherUrl
              description
              imageUrl
              createdDate
              videoProperties {
                audioCoding
                duration
                height
                mimeType
                size
                videoCoding
                width
              }
              audioProperties {
                audioCoding
                duration
                mimeType
                size
              }
              previews {
                imageLargeUrl
                imageMediumUrl
                imageSmallUrl
                imageOpengraphUrl
                predominantColor
                blurhash
              }
               contract {
                name
              }
            }
          }
        }
      }
      `

    const res = await fetch(`${VITE_AA_WALLET_API}/graphql`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'x-api-key': VITE_AA_API_KEY
      },
      body: JSON.stringify({
        query: query
      })
    })
    return res.json()
  }

  async getNftsByWallets(
    collectionIds: number | string,
    walletAddresses: string,
    cursor: string | null,
    limit: number
  ): Promise<GraphQLResponse<NFTByCollectResponse>> {
    const query = `
      query getNftsByWallets {
        nft {
          getNftsByWallets(request: {collectionIds: ["${collectionIds}"], walletAddresses: ["${walletAddresses}"], chainIds: [${customChains
            .map((chain) => chain.id)
            .join(',')}], limit: ${limit}, cursor: ${cursor ? `"${cursor}"` : null}} ) {
            count
            next
            items {
              name
              nftId
              contractAddress
              chain
              chainId
              audioUrl
              videoUrl
              tokenId
              otherUrl
              description
              imageUrl
              createdDate
              videoProperties {
                audioCoding
                duration
                height
                mimeType
                size
                videoCoding
                width
              }
              audioProperties {
                audioCoding
                duration
                mimeType
                size
              }
              previews {
                imageLargeUrl
                imageMediumUrl
                imageSmallUrl
                imageOpengraphUrl
                predominantColor
                blurhash
              }
               contract {
                name
              }
            }
          }
        }
      }
      `

    const res = await fetch(`${VITE_AA_WALLET_API}/graphql`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'x-api-key': VITE_AA_API_KEY
      },
      body: JSON.stringify({
        query: query
      })
    })
    return res.json()
  }

  async getCollectionsByWallets(
    walletAddresses: string,
    cursor: string | null
  ): Promise<GraphQLResponse<CollectionResponse>> {
    const query = `
      query getNftByWallet {
          nft {
            getCollectionsByWallets(
              request: {walletAddresses: "${walletAddresses}", chainIds: [${customChains
                .map((chain) => chain.id)
                .join(',')}], cursor: ${cursor ? `"${cursor}"` : null}}
            ) {
              items {
                collectionId
                distinctNftsOwned
                lastAcquiredDate
                nftIds
                collectionDetails {
                  name
                  imageUrl
                  chains
                  externalUrl
                  twitterUsername
                  discordUrl
                  mediumUsername
                }
              }
              next
            }
          }
        }`

    const res = await fetch(`${VITE_AA_WALLET_API}/graphql`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'x-api-key': VITE_AA_API_KEY
      },
      body: JSON.stringify({
        query: query
      })
    })
    return res.json()
  }
}
