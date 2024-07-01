import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TExploreItem = {
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
  isRemix: boolean
  isBookmark?: boolean
  socialLinks?: {
    explorerLink?: string
    website?: string
    discord?: string
    twitter?: string
    medium?: string
  }
}

type ExploreSliceType = {
  listExploreItem: TExploreItem[]
  exploreItem: TExploreItem | null
}

const initialState: ExploreSliceType = {
  listExploreItem: [],
  exploreItem: null
}

const exploreSlice = createSlice({
  initialState,
  name: 'exploreSlice',
  reducers: {
    createExploreItem: (state, action: PayloadAction<TExploreItem>) => {
      state.listExploreItem = [action.payload, ...state.listExploreItem]
    },

    setExploreItem: (state, action: PayloadAction<TExploreItem>) => {
      state.exploreItem = action.payload
    },

    setListExploreItem: (state, action: PayloadAction<TExploreItem[]>) => {
      state.listExploreItem = action.payload?.length ? action.payload : []
    },

    setBookmark: (state, action: PayloadAction<{ id: string; isBookmark: boolean }>) => {
      const { id, isBookmark } = action.payload
      const cloneListExploreItem = [...state.listExploreItem]
      const itemIndex = cloneListExploreItem.findIndex((e) => e.id === id)
      cloneListExploreItem[itemIndex] = { ...cloneListExploreItem[itemIndex], isBookmark }
      state.listExploreItem = cloneListExploreItem
    }
  }
})

export const exploreActions = exploreSlice.actions
export default exploreSlice.reducer
