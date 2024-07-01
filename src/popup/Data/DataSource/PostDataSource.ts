import BaseService from '../../../../services/axios'
import { GraphQLResponse, WalletConnectResponse } from '../../Domain/Model'
import {
  CreatePostAttributeInput,
  CreatePostInput,
  CreatePostMediaInput,
  PostResponse,
  Proposal,
  Publication
} from '../../Domain/Model/Publication'
import { PostDataSource } from './DataSource'

export class PostDataSourceImpl implements PostDataSource {
  private axiosClient: BaseService
  constructor(_axiosClient: BaseService) {
    this.axiosClient = _axiosClient
  }

  async createComment(
    postId: string,
    content: string,
    title: string
  ): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        createCommentOrQuote(publicationType: COMMENT, request: {title: "${title}", content: "${content}", publicationId: "${postId}"}) {
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
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: mutation
      })
    })
    return res.data
  }

  async getPostComments(postId: string, cursor: string): Promise<GraphQLResponse<Publication>> {
    const query = `
      query MyQuery {
        getPublicationById(postId: "${postId}") {
          comments(nextPage: {cursor: "${cursor}"}) {
            pageMeta {
              nextCursor
            }
            items {
              id
              collectCount
              dislikeCount
              likeCount
              commentCount
              title
              content
              metadata_
              media {
                altTag
                cover
                item
                type
              }
              profile {
                avatar
                id
                name
                handle
                isFollowedByMe
              }
              createdAt
              isCollectedByMe
              isMirroredByMe
              isReactedByMe
              authorHandle
            }
          }
        }
      }
    `
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: query
      })
    })
    return res.data
  }

  async mirror(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        mirror(mirrorOn: "${postId}") {
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
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: mutation
      })
    })
    return res.data
  }

  async getPoll(snapshotId: string): Promise<GraphQLResponse<Proposal>> {
    const query = `
      query {
        proposal(id:"${snapshotId}") {
          id
          title
          body
          choices
          start
          end
          state
          created
          scores
          scores_total
          votes
        }
      }
    `
    const res = await fetch('https://hub.snapshot.org/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: query
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res.json()
  }

  async removeReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        removeReaction(publicationId: "${postId}") {
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
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: mutation
      })
    })
    return res.data
  }

  async addReaction(postId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        addReaction(publicationId: "${postId}") {
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
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: mutation
      })
    })
    return res.data
  }

  async getPost(postId: string): Promise<GraphQLResponse<Publication>> {
    const query = `
      query MyQuery {
        getPublicationById(postId: "${postId}") {
          id
          collectCount
          dislikeCount
          likeCount
          commentCount
          title
          content
          metadata_
          media {
            altTag
            cover
            item
            type
          }
          profile {
            avatar
            id
            name
            handle
            isFollowedByMe
          }
          createdAt
          isCollectedByMe
          isMirroredByMe
          isReactedByMe
          authorHandle
        }
      }
    `
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: query
      })
    })
    return res.data
  }

  mapMedia(data: CreatePostMediaInput): string | null {
    if (data) {
      return `[${data.map((media) => {
        return `{
          item: "${media.item}"
          type: ${media.type}
        }`
      })}]`
    } else return null
  }

  mapAttribute(data: CreatePostAttributeInput): string | null {
    if (data) {
      return `[${data.map((media) => {
        return `{
          value: "${media.value}"
          traitType: ${media.traitType}"
        }`
      })}]`
    } else return null
  }

  async createPost(data: CreatePostInput): Promise<GraphQLResponse<WalletConnectResponse>> {
    const mutation = `
      mutation MyMutation {
        createPost(
          request: {
            animationUrl: ${JSON.stringify(data.animationUrl)}, 
            attributes: ${this.mapAttribute(data.attributes)}, 
            content: ${JSON.stringify(data.content)}, 
            contentWarning: ${data.contentWarning}, 
            description: ${JSON.stringify(data.description)}, 
            media: ${this.mapMedia(data.media)}, 
            name: ${JSON.stringify(data.name)}, 
            referenceModuleInput: {
              type: ${data.referenceModuleInput.type}
            }
          }
        ) {
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
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: mutation
      })
    })
    return res.data
  }

  async getPosts(query: string): Promise<GraphQLResponse<PostResponse>> {
    const res = await this.axiosClient.post({
      path: '/graphql',
      data: JSON.stringify({
        query: query
      })
    })
    return res.data
  }
}
