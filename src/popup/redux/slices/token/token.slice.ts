import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { storeTokenSetting } from '../../../../../utils/chromeStorage'
import { TokenFile } from '../../../../../utils/mapChains'
import { Collection, NFT } from '../../../Domain/Model/Token'
import { getNativeTokenBalanceThunk, getWalletBalanceThunk } from './tokenThunk'

type TokenState = {
  nftList: NFT[]
  isCollapse: boolean
  error: null
  next: string | null
  nftSellected: NFT | null
  countNft: number

  listLocalNFTId: string[]

  collections: Collection[]
  collectionSellected: Collection | null
  nextCollection: string | null
  errorCollection: string | null
  isFetchCollection: boolean

  isPrev: boolean
  isNeedLoadMore: boolean

  /** */
  nativeTokenBalance?: string
  walletBalance: string

  listToken: TokenFile[]
  listSearchToken: TokenFile[]

  fetchingNativeTokenBalance?: boolean
  errorFetchNativeTokenBalance?: string

  fetchingWalletBalance?: boolean
  errorFetchWalletBalance?: string
  /** */
}

const initialTokenState: TokenState = {
  nftList: [],
  isCollapse: false,
  error: null,
  next: null,
  nftSellected: null,
  countNft: 0,

  listLocalNFTId: [],

  collections: [],
  nextCollection: null,
  errorCollection: null,
  collectionSellected: null,
  isFetchCollection: false,

  isPrev: false,
  isNeedLoadMore: false,

  /** */
  listToken: [],
  listSearchToken: [],

  walletBalance: '0.00'
  /** */
}

const TokenSlice = createSlice({
  name: 'token',
  initialState: initialTokenState,
  reducers: {
    /** */
    setListToken: (state, action: PayloadAction<TokenFile[]>) => {
      //@ts-ignore
      state.listToken = action.payload
      storeTokenSetting(action.payload)
    },

    searchToken: (state, action: PayloadAction<{ tokenName: string }>) => {
      const _tempListToken = [...state.listToken]
      const _result = _tempListToken.reduce((acc: Array<TokenFile>, item) => {
        const _resultTokens = item.data.filter((token) => {
          return token.name.toLowerCase().includes(action.payload.tokenName.toLowerCase())
        })
        if (_resultTokens.length > 0) acc.push({ ...item, data: _resultTokens })
        return acc
      }, [])

      //@ts-ignore
      state.listSearchToken = _result
    },

    setActiveToken: (
      state,
      action: PayloadAction<{ chainId: number; tokenAddress: string; active?: boolean }>
    ) => {
      const { chainId, tokenAddress, active } = action.payload
      const _tempListToken = [...state.listToken]

      const _newListTokenState = _tempListToken.map((token) => {
        if (token.chainId === chainId) {
          const _tokenData = token?.data.map((e) => {
            if (e.address === tokenAddress) return { ...e, active }
            return e
          })
          return { ...token, data: _tokenData }
        }
        return token
      })

      state.listToken = _newListTokenState
      storeTokenSetting(_newListTokenState)
    },
    /** */

    setNFTList: (
      state,
      {
        payload
      }: PayloadAction<{ nfts: NFT[]; next: string | null; isLoadMore: boolean; count?: number }>
    ) => {
      if (payload.count) {
        state.countNft = payload.count
      }
      if (payload.isLoadMore) {
        state.nftList = [...state.nftList, ...payload.nfts]
      } else {
        state.nftList = payload.nfts
      }
      state.next = payload.next
    },
    handleChangeIndexToken: (
      state,
      { payload }: PayloadAction<{ nft: NFT; type: 'next' | 'prev' }>
    ) => {
      if (state.nftList.length > 0) {
        const findIndex = state.nftList.findIndex(
          (nft) =>
            nft.contractAddress === payload.nft.contractAddress &&
            nft.tokenId === payload.nft.tokenId
        )

        if (findIndex === 0) {
          state.isPrev = false
        }
        if (findIndex > 0) {
          state.isPrev = true
        }

        if (findIndex > -1) {
          switch (payload.type) {
            case 'next': {
              const nextIndex = findIndex + 1

              if (nextIndex > state.nftList.length - 1) {
                state.isNeedLoadMore = true
              } else {
                state.isNeedLoadMore = false
                state.nftSellected = state.nftList[nextIndex]
              }
              break
            }
            case 'prev': {
              const prevIndex = findIndex - 1
              if (prevIndex < 0) {
                state.nftSellected = state.nftList[state.nftList.length - 1]
              } else {
                state.nftSellected = state.nftList[prevIndex]
              }
              break
            }
            default:
              state.nftSellected = state.nftList[0]
              break
          }
        }
      }
    },
    handleChangeCollapse: (state, { payload }: PayloadAction<{ isCollapse: boolean }>) => {
      state.isCollapse = payload.isCollapse
    },

    setCollectionList: (
      state,
      {
        payload
      }: PayloadAction<{
        collections: Collection[]
        nextCollection: string | null
        isLoadMore: boolean
        isFilterAZ: boolean
      }>
    ) => {
      if (payload.isLoadMore) {
        state.collections = [...state.collections, ...payload.collections]
      } else if (payload.isFilterAZ) {
        const sortedArray = payload.collections.slice().sort((a, b) => {
          const nameA = a.collectionDetails.name.toLowerCase()
          const nameB = b.collectionDetails.name.toLowerCase()
          return nameA.localeCompare(nameB)
        })
        state.collections = sortedArray
      } else {
        state.collections = payload.collections
      }

      state.nextCollection = payload.nextCollection
    },

    setCollectionSellected: (
      state,
      { payload }: PayloadAction<{ collection: Collection | null }>
    ) => {
      state.collectionSellected = payload.collection
      state.isPrev = false
    },

    setNFTSellected: (state, { payload }: PayloadAction<{ nft: NFT | null }>) => {
      state.nftSellected = payload.nft
    },

    handleFilterCollections: (state, { payload }: PayloadAction<{ type: 'A-Z' | 'Z-A' }>) => {
      const tmpCollections = state.collections

      const sortedArray = tmpCollections.slice().sort((a, b) => {
        const nameA = a.collectionDetails.name.toLowerCase()
        const nameB = b.collectionDetails.name.toLowerCase()

        if (payload.type === 'A-Z') {
          return nameA.localeCompare(nameB)
        } else if (payload.type === 'Z-A') {
          return nameB.localeCompare(nameA)
        }
        return 0
      })
      state.collections = sortedArray
    },

    setIsFetchCollection: (state, { payload }: PayloadAction<boolean>) => {
      state.isFetchCollection = payload
    },

    setListLocalNFTId: (state, action: PayloadAction<string[]>) => {
      state.listLocalNFTId = action.payload
    }
  },

  extraReducers: (builder) => {
    /** GET NATIVE TOKEN BALANCE */
    builder.addCase(getNativeTokenBalanceThunk.pending, (state) => {
      state.fetchingNativeTokenBalance = true
    })
    builder.addCase(getNativeTokenBalanceThunk.fulfilled, (state, action) => {
      state.nativeTokenBalance = action.payload
      state.fetchingNativeTokenBalance = false
      state.errorFetchNativeTokenBalance = undefined
    })
    builder.addCase(getNativeTokenBalanceThunk.rejected, (state, action) => {
      if (action.error.name === 'AbortError') return // Happens when user quickly switches chain, don't make any changes to state
      state.fetchingNativeTokenBalance = false
      state.errorFetchNativeTokenBalance = action.payload as string
    })

    /** GET WALLET BALANCE */
    builder.addCase(getWalletBalanceThunk.pending, (state) => {
      state.fetchingWalletBalance = true
    })
    builder.addCase(getWalletBalanceThunk.fulfilled, (state, action) => {
      state.walletBalance = action.payload
      state.fetchingWalletBalance = false
      state.errorFetchWalletBalance = undefined
    })
    builder.addCase(getWalletBalanceThunk.rejected, (state, action) => {
      state.fetchingWalletBalance = false
      state.errorFetchWalletBalance = action.payload as string
    })
  }
})

export const {
  setNFTList,
  handleChangeCollapse,
  setCollectionList,
  setCollectionSellected,
  setNFTSellected,
  handleChangeIndexToken,
  handleFilterCollections,
  setIsFetchCollection,
  setListLocalNFTId
} = TokenSlice.actions

export const tokenActions = TokenSlice.actions
export default TokenSlice.reducer
