import { GetBalanceReturnType, getBalance } from '@wagmi/core'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setChain } from '../../../../utils/chromeStorage'
import {
  getWalletBalanceAction,
  setWallet,
  switchWalletNetwork,
  updateWalletBalance
} from '../slices/wallet/wallet.slice'
import { RootState } from '../store'
import { formatUnits } from 'viem'

function* getWalletBalance() {
  try {
    const state: RootState = yield select()
    const wallet = state.wallet.wallet
    const chain = state.wallet.chain
    let balance: GetBalanceReturnType | undefined
    if (wallet && chain)
      //@ts-ignore
      balance = yield call(getBalance, {
        address: wallet?.account.address,
        chainId: chain?.id
      })
    const state_now: RootState = yield select()
    // Handle for race condition
    if (chain?.id === state_now.wallet.chain?.id) {
      if (balance) yield put(updateWalletBalance(formatUnits(balance.value, balance.decimals)))
    }
  } catch (error) {
    // console.log(error)
  }
}

function* storeChain(action) {
  const chain = action.payload
  yield call(setChain, chain)
}

function* WalletSaga() {
  yield takeLatest(getWalletBalanceAction, getWalletBalance)
  // yield takeLatest(setWallet, getWalletBalance)
  // yield takeLatest(switchWalletNetwork, getWalletBalance)
  yield takeLatest(switchWalletNetwork, storeChain)
}

export default WalletSaga
