import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Chain } from 'viem'
import { customChains } from '../../../../../utils/mapChains'
import { EOAWallet, Wallet } from '../../../../../utils/wallet'

type WalletState = {
  wallet: Wallet | undefined
  balance: string
  chain: Chain
  error: null
  isLock: boolean
  refetchTotal: boolean
}

const initialWalletState: WalletState = {
  wallet: undefined,
  balance: '0',
  chain: customChains[0],
  error: null,
  isLock: false,
  refetchTotal: true
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState: initialWalletState,
  reducers: {
    setWallet: (state, { payload }: PayloadAction<{ wallet: Wallet }>) => {
      //@ts-ignore
      state.wallet = payload.wallet
      const isEOA = payload.wallet instanceof EOAWallet
      chrome.runtime.sendMessage({
        type: 'updateWallet',
        wallet: JSON.stringify({
          instance: isEOA ? 'eoa' : 'wc',
          ...payload.wallet
        })
      })
    },
    setLockWallet: (state, { payload }: PayloadAction<boolean>) => {
      state.isLock = payload
    },
    logoutWallet: (state) => {
      state.wallet = undefined
      state.isLock = false
    },
    getWalletBalanceAction: (_s) => {},
    updateWalletBalance: (state, { payload }: PayloadAction<string>) => {
      state.balance = payload
    },
    switchWalletNetwork: (state, { payload }: PayloadAction<Chain>) => {
      //@ts-ignore
      state.chain = payload
      chrome.runtime.sendMessage({ type: 'updateChain', chain: payload })
    },
    setRefetchTotal: (state, { payload }: PayloadAction<boolean>) => {
      state.refetchTotal = payload
    }
  }
})

export const {
  setRefetchTotal,
  setWallet,
  setLockWallet,
  logoutWallet,
  getWalletBalanceAction,
  updateWalletBalance,
  switchWalletNetwork
} = walletSlice.actions

export default walletSlice.reducer
