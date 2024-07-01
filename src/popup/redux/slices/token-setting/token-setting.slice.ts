import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { storeTokenSetting } from '../../../../../utils/chromeStorage'
import { TokenFile } from '../../../../../utils/mapChains'

type TokenSettingState = {
  error: null
  tokenFiles: TokenFile[]
  total: string
  loadingTotal: boolean
  tokenFilesSearch: TokenFile[]
  balanceUpdatedAt: number | undefined
}

const initialTokenSettingState: TokenSettingState = {
  error: null,
  tokenFiles: [],
  total: '0.00',
  loadingTotal: false,
  tokenFilesSearch: [],
  balanceUpdatedAt: undefined
}

const TokenSettingSlice = createSlice({
  name: 'token-setting',
  initialState: initialTokenSettingState,
  reducers: {
    setTokenFiles: (state, { payload }: PayloadAction<{ tokenFiles }>) => {
      state.tokenFiles = payload.tokenFiles
      storeTokenSetting(payload.tokenFiles)
    },
    changeActiveToken: (state, { payload }: PayloadAction<{ token; chainId }>) => {
      const tmpListTokenFiles = state.tokenFiles

      const index = tmpListTokenFiles.findIndex(
        (tokenFile) => tokenFile.chainId === payload.chainId
      )
      const indexToken = tmpListTokenFiles[index].data.findIndex(
        (t) => t.address === payload.token.address
      )

      tmpListTokenFiles[index].data[indexToken].active =
        !tmpListTokenFiles[index].data[indexToken].active

      state.tokenFiles = tmpListTokenFiles
      storeTokenSetting(tmpListTokenFiles)
    },
    setTotal: (state, { payload }: PayloadAction<string>) => {
      state.total = payload
      state.balanceUpdatedAt = new Date().getTime()
    },
    setLoadingTotal: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingTotal = payload
    },
    searchToken: (state, { payload }: PayloadAction<{ tokenName: string }>) => {
      const tmpListTokenFiles = state.tokenFiles
      const inputNameLower = payload.tokenName.toLowerCase()

      const filteredItems = tmpListTokenFiles.reduce((acc: Array<TokenFile>, item) => {
        const filteredData = item.data.filter((subItem) =>
          subItem.name.toLowerCase().includes(inputNameLower)
        )

        if (filteredData.length > 0) {
          acc.push({ ...item, data: filteredData })
        }

        return acc
      }, [])

      //@ts-ignore
      state.tokenFilesSearch = filteredItems
    },
    updateTotalBalance: (_state, action) => {},
    fetchTotalFailed: (state) => {
      state.loadingTotal = false
      state.total = '0.00'
    }
  }
})

export const {
  setTokenFiles,
  changeActiveToken,
  setTotal,
  setLoadingTotal,
  searchToken,
  updateTotalBalance,
  fetchTotalFailed
} = TokenSettingSlice.actions

export default TokenSettingSlice.reducer
