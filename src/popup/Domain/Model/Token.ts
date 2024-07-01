export interface NFT {
  name: string
  nftId: string
  contractAddress: string
  chain: string
  description: string
  chainId: string
  audioUrl: string | null
  videoUrl: string | null
  tokenId: string
  otherUrl: string | null
  createdDate: string
  imageUrl: string | null
  contract: {
    name: string
  }
  videoProperties: {
    audioCoding: string
    duration: number
    height: number
    mimeType: string
    size: string
    videoCoding: string
    width: number
  } | null
  audioProperties: {
    audioCoding: string
    duration: number
    mimeType: string
    size: string
  } | null
  previews: {
    imageLargeUrl: string | null
    imageMediumUrl: string | null
    imageSmallUrl: string | null
    imageOpengraphUrl: string | null
    predominantColor: string | null
    blurhash: string | null
  }
}

export interface Collection {
  collectionId: string | number
  distinctNftsOwned: string
  lastAcquiredDate: string
  nftIds: string[]
  collectionDetails: {
    name: string
    imageUrl: string
    chains: number[]
    externalUrl: string | null
    twitterUsername: string | null
    discordUrl: string | null
    mediumUsername: string | null
  }
}

export interface NFTResponse {
  getNftsByWallets: {
    items: Array<NFT>
    next?: string
    count: number
  }
}

export interface NFTByCollectResponse {
  getNftsByWallets: {
    items: Array<NFT>
    next?: string
    count: number
  }
}

export interface CollectionResponse {
  getCollectionsByWallets: {
    items: Array<Collection>
    next?: string
    count: number
  }
}
