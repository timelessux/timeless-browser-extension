import { erc20Abi, formatUnits } from 'viem'
import { getBalance, readContract, readContracts } from 'wagmi/actions'
import BaseService from '../../../services/axios'
import { HexString } from '../../../ts/types'
import { TokenFile } from '../../../utils/mapChains'
import { WalletConnectRepository } from '../Domain/Repository'
import { _wagmiConfig } from '../configs/wagmiConfig'

export const getNativeTokenBalanceRequest = async (payload: {
  walletAddress: HexString
  chainId?: number
}): Promise<{ data?: string; error?: any }> => {
  try {
    const _nativeTokenBalance = await getBalance(_wagmiConfig, {
      address: payload.walletAddress,
      chainId: payload.chainId
    })

    return {
      data: formatUnits(_nativeTokenBalance.value, _nativeTokenBalance.decimals)
    }
  } catch (error) {
    return error
  }
}

export const getERC20TokenBalanceRequest = async (payload: {
  walletAddress: HexString
  tokenAddress: HexString
  tokenDecimal: number
  chainId?: number
}): Promise<{ data?: string; error?: any }> => {
  try {
    const _erc20TokenBalance = await readContract(_wagmiConfig, {
      chainId: payload.chainId,
      abi: erc20Abi,
      address: payload.tokenAddress,
      functionName: 'balanceOf',
      args: [payload.walletAddress]
    })

    return {
      data: formatUnits(_erc20TokenBalance, payload.tokenDecimal)
    }
  } catch (error) {
    return error
  }
}

export const getWalletBalanceRequest = async (payload: {
  walletAddress: HexString
  listToken: TokenFile[]
}): Promise<{ data?: string; error?: any }> => {
  try {
    const { walletAddress, listToken } = payload

    let _total = 0

    for (const tokenFile of listToken) {
      const _mapContracts = tokenFile.data
        .filter((e) => e.address !== '0x0000000000000000000000000000000000000000')
        .map((e) => ({
          chainId: tokenFile.chainId,
          abi: erc20Abi,
          address: e.address as HexString,
          functionName: 'balanceOf',
          args: [walletAddress]
        }))

      const _coinGeckoIds = tokenFile.data.map((e) => `${tokenFile.chainId}:${e.token_symbol}`)

      const _result = await Promise.all([
        getBalance(_wagmiConfig, {
          address: walletAddress,
          chainId: tokenFile.chainId
        }),
        readContracts(_wagmiConfig, { contracts: _mapContracts }),
        WalletConnectRepository(new BaseService()).getTokenPrice(_coinGeckoIds, 'usd')
      ])

      const _nativeTokenBalance = _result[0]
      const _listERC20TokenBalance = _result[1]
      const _listTokenUSDPrice = _result[2]?.data?.chain.getTokenPrice ?? []

      const _nativeTokenUSDPrice = _listTokenUSDPrice.find(
        (e) => e.tokenId === `${tokenFile.chainId}:${_nativeTokenBalance.symbol}`
      )?.price.usd

      _total +=
        Number(formatUnits(_nativeTokenBalance.value, _nativeTokenBalance.decimals)) *
        Number(_nativeTokenUSDPrice)

      _total += tokenFile.data
        .filter((e) => e.address !== '0x0000000000000000000000000000000000000000')
        .reduce((acc, current, currentIndex) => {
          const _balance = formatUnits(
            _listERC20TokenBalance[currentIndex].result as bigint,
            Number(current.default_decimals)
          )

          const _usdPrice = _listTokenUSDPrice.find((b) => {
            return b.tokenId === `${tokenFile.chainId}:${current.token_symbol}`
          })

          return acc + Number(_balance) * Number(_usdPrice?.price.usd ?? 0)
        }, 0)
    }

    return { data: _total.toFixed(2) }
  } catch (error) {
    return error
  }
}
