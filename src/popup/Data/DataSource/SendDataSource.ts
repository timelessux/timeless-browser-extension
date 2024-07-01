import BaseService from '../../../../services/axios'
import { IWallet } from '../../Domain/Repository/SendRepository'
import { SendDataSource } from './DataSource'

export class SendDataSourceImpl implements SendDataSource {
  private axiosClient: BaseService
  constructor(_axiosClient: BaseService) {
    this.axiosClient = _axiosClient
  }
  async getRecipientAccount({ address }: { address: string }): Promise<IWallet> {
    const query = `query MyQuery {
      getWallet(address: "${address}") {
        address
        defaultProfile {
            avatar
            name
        }
      }
    }`
    const res = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({
        query: query
      })
    })
    return res.data.data.getWallet
  }
}
