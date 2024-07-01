import { getBalance, multicall } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import BaseService from '../../../../services/axios'
import { HexString } from '../../../../ts/types'
import { Wallet } from '../../../../utils/wallet'
import { WalletConnectRepository } from '../../Domain/Repository'
import {
  fetchTotalFailed,
  setLoadingTotal,
  setTokenFiles,
  setTotal,
  updateTotalBalance
} from '../../redux/slices/token-setting/token-setting.slice'
import { RootState } from '../store'
import { _wagmiConfig } from '../../configs/wagmiConfig'

const mapContracts = (contract, address) => {
  return {
    address: contract.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address]
  }
}

async function getTotalBalance(tokenFiles, wallet: Wallet) {
  if (tokenFiles.length === 0) {
    return {
      tokenFiles: tokenFiles,
      total: 0
    }
  }
  const chainBalances = []
  for (const file of tokenFiles) {
    if (file.data.length > 0) {
      const tokenArr = []
      let tokenData
      for (const token of file.data) {
        if (token.address === '0x0000000000000000000000000000000000000000') {
          const balance = await getBalance(_wagmiConfig, {
            address: wallet?.account.address as HexString,
            chainId: file.chainId
          })
          tokenData = {
            chainId: file.chainId,
            data: [
              {
                ...token,
                amount: balance.formatted,
                priceUSD: 0
              }
            ]
          }
        } else {
          //@ts-ignore
          tokenArr.push(token)
        }
      }
      const res = await multicall(_wagmiConfig, {
        chainId: file.chainId,
        contracts: [...tokenArr.map((token) => mapContracts(token, wallet.account.address))]
      })

      res.map((bal, idx) => {
        if (bal.result !== undefined) {
          const decimal = BigInt(10) ** BigInt(tokenArr[idx]['default_decimals'])
          const balance = String((Number(bal.result) / Number(decimal)).toFixed(5))
          tokenData.data.push({
            //@ts-ignore
            ...tokenArr[idx],
            amount: balance,
            priceUSD: 0
          })
        } else {
          tokenData.data.push({
            //@ts-ignore
            ...tokenArr[idx],
            amount: '0.000000',
            priceUSD: 0
          })
        }
      })
      //@ts-ignore
      chainBalances.push(tokenData)
    }
  }
  const coinGeckoIds: Array<string> = []
  chainBalances.map((item) =>
    //@ts-ignore
    item.data.map((bal) => coinGeckoIds.push(`${item.chainId}:${bal.token_symbol}`))
  )
  const axiosClient = new BaseService()
  const res = await WalletConnectRepository(axiosClient).getTokenPrice(coinGeckoIds, 'usd')
  let total = 0
  const tokensUpdated = chainBalances.map((chain, idx) => ({
    //@ts-ignore
    ...chain,
    name: tokenFiles[idx].name,
    chain: tokenFiles[idx].chain,
    //@ts-ignore
    data: chain.data.map((bal) => {
      let priceUSD = 0
      if (res.data) {
        const price = res.data['chain'].getTokenPrice.find(
          //@ts-ignore
          (token) => token.tokenId === `${chain.chainId}:${bal.token_symbol}`
        )
        if (price) {
          priceUSD = price.price.usd ? price.price.usd : 0
        }
      }
      total += priceUSD * Number(bal.amount)
      return {
        ...bal,
        active: bal.active ?? Number(bal.amount) > 0,
        priceUSD: priceUSD
      }
    })
  }))
  return {
    tokenFiles: tokensUpdated,
    total
  }
}

function* fetchTotalBalance(action) {
  try {
    const state: RootState = yield select()
    const wallet = state.wallet.wallet
    const { balanceUpdatedAt } = state.tokenSetting
    const payload = action.payload
    const timestampNow = new Date().getTime()
    if (!balanceUpdatedAt || timestampNow - balanceUpdatedAt > 900000 || payload.force) {
      yield put(setLoadingTotal(true))
      let result
      if (wallet) result = yield call(getTotalBalance, payload.tokenFiles, wallet)
      yield put(setTotal(result.total.toFixed(2)))
      yield put(setLoadingTotal(false))
      if (result.tokenFiles && result.tokenFiles.length > 0) {
        yield put(setTokenFiles({ tokenFiles: result.tokenFiles }))
      }
    }
  } catch (error) {
    yield put(fetchTotalFailed())
  }
}

function* TokenSettingSaga() {
  yield takeLatest(updateTotalBalance, fetchTotalBalance)
}

export default TokenSettingSaga
