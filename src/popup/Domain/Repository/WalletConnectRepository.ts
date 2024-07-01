import { GraphQLResponse, WalletConnectResponse } from '../Model'

export interface QuoteRequest {
  fromToken: string
  toToken: string
  fromAmount: number
  senderAddress: string
}

export interface SwapToken {
  address: string
  chainId: string
  decimals: number
  symbol: string | null
  name: string | null
  coinKey: string | null
  logoURI: string | null
  priceUSD: number
}

export interface QuoteResponse {
  getSwapQuote: {
    items: Array<{
      data: {
        to: string
        value: string
        callData: `0x${string}`
        chainId: number
        gasLimit?: string
      }
      estimate: {
        tool: string | null
        approvalAddress: string | null
        toAmountMin: number | null
        toAmount: number
        fromAmount: number
        feeCosts: {
          name: string
          description: string
          token: SwapToken
          amount: number
          amountUSD: number
          percentage: string
          included: boolean
        }
        gasCosts: {
          type: string
          price: string
          estimate: string
          limit: string
          token: SwapToken
          amount: number
          amountUSD: number
        }
        executionDuration: string | null
        fromAmountUSD: number
        toAmountUSD: number
      }
      provider: {
        type: 'LIFI' | 'KYBERSWAP'
        icon: string
        name: string
      }
    }>
  }
}

export interface TokenPriceResponse {
  getTokenPrice: Array<{
    tokenId: string
    price: {
      usd: number | null
      usedMarketCap: number | null
      usd24hVol: number | null
      usd24hChange: number | null
    }
  }>
}

export interface OnRampResponse {
  signMoonpayUrl: string
}

export interface WalletConnectRepository {
  request(id: string, params: string): Promise<GraphQLResponse<WalletConnectResponse>>
  getQuote(request: QuoteRequest): Promise<GraphQLResponse<QuoteResponse>>
  getTokenPrice(
    ids: Array<string>,
    vsCurrencies: string
  ): Promise<GraphQLResponse<TokenPriceResponse>>
  signMoonpayUrl(url: string): Promise<GraphQLResponse<OnRampResponse>>
}
