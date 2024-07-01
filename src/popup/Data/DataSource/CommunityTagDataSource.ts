import BaseService from '../../../../services/axios'
import { CommunityTag } from '../../Domain/Repository/CommunityTagRepository'
import { CommunityTagDataSource } from './DataSource'

export class CommunityTagDataSourceImpl implements CommunityTagDataSource {
  private axiosClient: BaseService
  constructor(_axiosClient: BaseService) {
    this.axiosClient = _axiosClient
  }
  async getCommunityTags(): Promise<CommunityTag[]> {
    const query = `query MyQuery {
      getTimelessCommunityTag {
        createdAt
        description
        name
        tag
      }
    }`
    const res = await this.axiosClient.post({
      path: '/graphql/',
      data: JSON.stringify({
        query: query
      }),
      option: {
        headers: {
          'Content-type': 'application/json'
        }
      }
    })
    return res.data.data.getTimelessCommunityTag
  }
}
