import { EContentWaring, EMimeType, EReferenceModule } from '../../../../ts'
import { Profile } from './Profile'

export interface PublicationMedia {
  item: string
  type: string
  cover: string
  altTag: string | null
}

export interface PublicationAttribute {
  traitType?: string
  displayType?: string
  value?: string
  key?: string
}

export interface PublicationMetadata {
  mainContentFocus?: string
  metadata?: {
    content: string
    description: string
    external_url: string
    image: string
    image_data: string
    issue_date: string
    media: {
      type: string
      altTag: string
      item: string
      cover: string
    }
    name: string
  }
  attributes: {
    displayType: string
    traitType: string
    value: string
  }[]
  lens?: { mainContentFocus?: string }
  image: string
  content: string
  name: string
  media: {
    original: {
      cover: string
      item: string
      type: string
      altTag: string | null
    }
  }[]
  external_url: string
}

export interface Publication {
  __typename: string
  id: string
  appId?: string
  authorHandle?: string
  content?: string
  createdAt?: string
  collectCount?: number
  dislikeCount?: number
  commentCount?: number
  likeCount?: number
  mirrorCount?: number
  isCollectedByMe?: boolean
  isMirroredByMe?: boolean
  isReactedByMe?: boolean
  metadata_?: PublicationMetadata
  nftAddress?: null | string
  originalUrl?: string
  provider?: string
  title?: string
  type?: string
  updatedAt?: string
  media?: Array<PublicationMedia>
  profile?: Profile
  parentPost?: Publication
  comments?: PostResponse
}

export interface Proposal {
  id?: string
  title?: string
  body?: string
  choices?: string[]
  start?: number
  end?: number
  state?: string
  created?: number
  scores: number[]
  scores_total: number
  votes?: number
  author: string
}

export interface PostResponse {
  items: Array<Publication>
  pageMeta: {
    nextCursor: string | null
  }
}

export type CreatePostMediaInput = Array<{
  item: string
  type: EMimeType
}> | null

export type CreatePostAttributeInput = Array<{
  traitType: string
  value: string
}> | null

export interface CreatePostInput {
  name: string | null
  description: string | null
  content: string | null
  contentWarning: EContentWaring | null
  media: CreatePostMediaInput
  attributes: CreatePostAttributeInput
  animationUrl: string | null
  referenceModuleInput: {
    type: EReferenceModule
  }
  tags: string[] | null
}
