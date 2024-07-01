import { GraphQLResponse, WalletConnectResponse } from '../../Domain/Model'
import {
  OnRampResponse,
  QuoteRequest,
  QuoteResponse,
  TokenPriceResponse,
  WalletConnectRepository
} from '../../Domain/Repository/WalletConnectRepository'
import { WalletConnectDatasource } from '../DataSource/DataSource'

export class WalletConnectRepositoryImpl implements WalletConnectRepository {
  private walletConnectDatasource: WalletConnectDatasource
  constructor(_walletConnectDatasource: WalletConnectDatasource) {
    this.walletConnectDatasource = _walletConnectDatasource
  }

  signMoonpayUrl(url: string): Promise<GraphQLResponse<OnRampResponse>> {
    return this.walletConnectDatasource.signMoonpayUrl(url)
  }
  getTokenPrice(ids: string[], vsCurrencies: string): Promise<GraphQLResponse<TokenPriceResponse>> {
    return this.walletConnectDatasource.getTokenPrice(ids, vsCurrencies)
  }

  getQuote(request: QuoteRequest): Promise<GraphQLResponse<QuoteResponse>> {
    return this.walletConnectDatasource.getQuote(request)
  }

  request(id: string, params: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.walletConnectDatasource.request(id, params)
  }
}
