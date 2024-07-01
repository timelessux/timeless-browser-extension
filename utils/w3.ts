import { createAmountFromString, publicActionReverseMirage } from 'reverse-mirage'
import { Account, createPublicClient, http } from 'viem'
import { GetPublicClientReturnType } from 'wagmi/actions'
import {
  getERC20TokenBalanceRequest,
  getNativeTokenBalanceRequest
} from '../src/popup/services/tokenService'
import { HexString, TToken } from '../ts/types'
import { MyChain } from './mapChains'

export const gasEstimator = (
  from: Account | HexString,
  to: HexString,
  value: bigint,
  client?: GetPublicClientReturnType,
  data?: HexString
) => {
  return client?.estimateGas({ account: from, to, value, data })
}

export const _getTokenBalance = async (payload: {
  walletAddress: HexString
  token: TToken
  chainId?: number
}) => {
  const { walletAddress, token, chainId } = payload

  if (token.address === '0x0000000000000000000000000000000000000000') {
    const { data } = await getNativeTokenBalanceRequest({ walletAddress, chainId })
    return data
  }

  const { data } = await getERC20TokenBalanceRequest({
    chainId,
    walletAddress,
    tokenAddress: token.address,
    tokenDecimal: token.default_decimals
  })

  return data
}

interface ERC20TransactionParams {
  from: HexString
  to: HexString
  amount: string
  chain: MyChain
  tokenAddress: HexString
}

export const buildERC20Transaction = async (props: ERC20TransactionParams) => {
  const { from, to, amount, chain, tokenAddress } = props

  const _publicClient = createPublicClient({
    chain,
    transport: http(chain.rpc)
  }).extend(publicActionReverseMirage)

  const _erc20Token = await _publicClient.getERC20({
    erc20: {
      address: tokenAddress,
      chainID: chain.id
    }
  })

  const { request } = await _publicClient.simulateERC20Transfer({
    account: from,
    args: { to, amount: createAmountFromString(_erc20Token, amount) }
  })

  return request
}
