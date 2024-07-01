import BaseService from '../../../../services/axios'
import { GraphQLResponse, WalletConnectResponse } from '../../Domain/Model'
import {
  OnRampResponse,
  QuoteRequest,
  QuoteResponse,
  TokenPriceResponse
} from '../../Domain/Repository/WalletConnectRepository'
import { WalletConnectDatasource } from './DataSource'

const { VITE_AA_WALLET_API } = import.meta.env
export class WalletConnectDatasourceImpl implements WalletConnectDatasource {
  private axiosClient: BaseService

  constructor(_axiosClient: BaseService) {
    this.axiosClient = _axiosClient
  }
  async signMoonpayUrl(url: string): Promise<GraphQLResponse<OnRampResponse>> {
    const query = `
      query MyQuery {
        onRamp {
          signMoonpayUrl(url: "${url}")
        }
      }
    `
    const response = await this.axiosClient.post({
      path: `${VITE_AA_WALLET_API}/graphql`,
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async getTokenPrice(
    ids: string[],
    vsCurrencies: string
  ): Promise<GraphQLResponse<TokenPriceResponse>> {
    const query = `
      query MyQuery {
        chain {
          getTokenPrice(
            request: 
            {ids: [${ids.map((id) => `"${id}"`)}], 
            vsCurrencies: "${vsCurrencies}"}
            ) {
            price {
              usd
              usdMarketCap
              usd24hVol
              usd24hChange
            }
            tokenId
          }
        }
      }
    `
    const response = await this.axiosClient.post({
      path: `${VITE_AA_WALLET_API}/graphql`,
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async getQuote(request: QuoteRequest): Promise<GraphQLResponse<QuoteResponse>> {
    const query = `
      query MyQuery {
        intentBuilder {
          getSwapQuote(
            request: {
              fromToken: "${request.fromToken}", 
              toToken: "${request.toToken}", 
              fromAmount: "${request.fromAmount}", 
              senderAddress: "${request.senderAddress}"
            }
          ) {
            items {
              estimate {
                fromAmount
                toAmount
              }
              data {
                callData
                chainId
                gasLimit
                to
                value
              }
            }
          }
        }
      }
    `
    const response = await this.axiosClient.post({
      path: `${VITE_AA_WALLET_API}/graphql`,
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async request(id: string, params: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        walletConnectRequest(request: {id: "${id}", params: ["${params}"]}) {
          failReason
          id
          nextStep {
            chainId
            method
            params
          }
          publicationId
          status
          txId
        }
      }
    `
    const response = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({ query: mutation })
    })
    return response.data
  }
}
