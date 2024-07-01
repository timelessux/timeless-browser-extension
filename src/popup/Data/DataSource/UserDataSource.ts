import BaseService from '../../../../services/axios'
import { EProvider, ETypeProfile } from '../../../../ts'
import { deleteToken } from '../../../../utils/token'
import { GraphQLResponse, WalletConnectResponse } from '../../Domain/Model'
import { ChallengeResponse } from '../../Domain/Model/Auth'
import { ListProfileResponse, Profile } from '../../Domain/Model/Profile'
import { Token } from '../../Domain/Repository/UserRepository'
import { UserDataSourceInterface } from './DataSource'

export class UserDataSource implements UserDataSourceInterface {
  private axiosClient: BaseService

  constructor(_axiosClient: BaseService) {
    this.axiosClient = _axiosClient
  }

  async collect(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        collect(publicationId: "${postId}") {
          failReason
          id
          nextStep {
            chainId
            params
            method
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

  async follow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        follow(profileId: "${profileId}") {
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

  async createChangeProfileManagersTypedData(): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        createChangeProfileManagerTypedData {
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

  async getProfileByHandles(handle: string): Promise<GraphQLResponse<Array<Profile>>> {
    const query = `
      query MyQuery {
        getProfileByHandles(handles: "${handle}") {
          bio
          id
          createdAt
          avatar
          name
        }
      }
    `
    const response = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async unfollow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        unfollow(profileId: "${profileId}") {
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

  async checkProxyActionStatus(proxyId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const query = `
      query MyQuery {
        proxyActionStatus(proxyId: "${proxyId}") {
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
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async getProfile(address: string): Promise<GraphQLResponse<ListProfileResponse>> {
    const query = `
      query MyQuery {
        getWallet(address: "${address}") {
          profiles {
            avatar
            bio
            coverAvatar
            handle
            id
            isFollowedByMe
            name
            ownerAddress
            totalCollects
            totalFollowers
            totalPosts
            totalPublications
            type
            createdAt
            deleted
            isDefault
            isProviderDefault
            attributes {
              displayType
              key
              value
              traitType
            }
            updatedAt
            originalUrl
            wallet {
              totalFollowers
              totalFollowings
            }
          }
        }
      }
    `
    const response = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async getLeaderboards(
    provider: EProvider,
    type: ETypeProfile
  ): Promise<GraphQLResponse<ListProfileResponse>> {
    const query = `
      query MyQuery {
         getLeaderboard(provider: ${provider}, type_: ${type}, limit: 10) {
          profiles {
            avatar
            handle
            id
            isFollowedByMe
            name
          }
        }
      }
    `
    const response = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({ query: query })
    })
    return response.data
  }

  async authenticateWithLens(
    signature: string,
    address: string,
    authId: string
  ): Promise<Token | null> {
    const mutation = `
      mutation MyMutation {
        authenticate(provider: LENS, signature: "${signature}", authId: "${authId}") {
          accessToken
          refreshToken
          address
        }
      }
    `
    const response = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({ query: mutation }),
      option: {
        headers: {
          'x-wallet-address': address,
          'Content-Type': 'application/json'
        }
      }
    })
    if (response.data.errors) return null
    return response.data.data.authenticate
  }

  async getAuthChalenge(
    address: string,
    profileId: string
  ): Promise<GraphQLResponse<ChallengeResponse>> {
    const query = `
      query MyQuery {
        getAuthChallenge(provider: LENS) {
          authId
          text
          provider
        }
      }
    `
    const response = await this.axiosClient.post({
      path: 'graphql',
      data: JSON.stringify({ query }),
      option: {
        headers: {
          'x-wallet-address': address,
          'x-profile-id': profileId,
          'Content-Type': 'application/json'
        }
      }
    })
    return response.data
  }

  async login(username: string, password: string): Promise<Token | null> {
    await deleteToken()
    const response = await this.axiosClient.post({
      path: 'auth/login',
      option: {
        headers: {
          Authorization: 'Basic ' + btoa(username + ':' + password)
        }
      }
    })

    if (response.status == 200) {
      const data = response.data ?? {}
      return {
        accessToken: data.access_token ?? '',
        refreshToken: data.refresh_token ?? ''
      }
    }
    return null
  }

  async refreshToken(token: Token): Promise<Token | null> {
    const response = await this.axiosClient.post({
      path: 'auth/refresh_token',
      data: JSON.stringify({
        refresh_token: token.refreshToken
      })
    })

    if (response.status == 200) {
      const data = response.data ?? {}
      return {
        accessToken: data.access_token ?? '',
        refreshToken: data.refresh_token ?? ''
      }
    }
    return null
  }
}
