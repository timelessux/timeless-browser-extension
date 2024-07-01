import { TExploreItem } from '../src/popup/redux/slices/explore/exploreSlice'

const _base_url = 'https://story-protocol-stag.api.timelesswallet.xyz/api/story_protocol'

export type ExploreItemDTO = {
  id: string
  type: string
  curator: {
    id: string
    name: string
  }
  mediaUrl: string
  name: string
  description: string
  thumbnail: string
  price: number
  links: string[]
  parentId: string
  txHash: string
  ipOrg: {
    id: string
    name: string
    txHash: string
    createdAt: string
  }
  createdAt: string
}

export const parseToExploreItem = (item: ExploreItemDTO): TExploreItem => {
  return {
    ...item,
    isRemix: !!item.parentId,
    socialLinks: {
      explorerLink: `https://sepolia.etherscan.io/tx/${item.txHash}`
    }
  }
}

export const getStoreItems = async (): Promise<TExploreItem[]> => {
  const response = await fetch(`${_base_url}/ip-assets/`)
  const list = await response.json()
  return list.map(parseToExploreItem).reverse()
}

export const createStoreItem = async (payload: Partial<ExploreItemDTO>): Promise<TExploreItem> => {
  const response = await fetch(`${_base_url}/ip-assets/`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const rawExploreItem = await response.json()
  return parseToExploreItem(rawExploreItem)
}

export const getItemTree = async (id: string): Promise<TExploreItem[]> => {
  const response = await fetch(`${_base_url}/ip-assets/${id}/ip-tree/`)
  const list = await response.json()
  return list.map(parseToExploreItem).reverse()
}
