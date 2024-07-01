import { ARTICLE_DISPLAY_VIEW } from '../src/popup/constants/article'
import { articleDetail } from './exampleResponse/article'
import { spindl } from './exampleResponse/spindl'

export type TArticleState = {
  articleForYou?: TArticle
  mint?: TArticle
  popularCreators?: TArticle
  questsForYou?: TArticle
  trendingInfluencers?: TArticle
  trendingMints?: TArticle
  trendingDApp?: TSpindl[]

  isCollapse: boolean

  previousView?: ARTICLE_DISPLAY_VIEW
  currentView?: ARTICLE_DISPLAY_VIEW

  articleId?: string
  articleDetail?: TArticleDetail

  articleType?: Omit<TArticle, 'transactions'>
  listArticleByType?: TArticleTransaction[]

  fetchingListArticle?: boolean
  errorFetchListArticle?: string

  fetchingArticleById?: boolean
  errorFetchArticleById?: string

  fetchingListArticleByType?: boolean
  errorFetchListArticleByType?: string

  fetchingListSpindl?: boolean
  errorFetchListSpindl?: string
}

export type TArticle = {
  key: string
  title: string
  description: string
  transactions: TArticleTransaction[]
}

export type TArticleTransaction = {
  type: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrls: { xs: string; sm: string }
  openAt: string
  closeAt: string | null
  isClosed: boolean
  createdAt: string
  chain: string
  sourceId: string
  uid: string
  slug: string
  action: { linkUrl: string; isCompletableOnChain: boolean }
  supplier: { id: number; name: string; slug: string; url: string }
  submitter: any | null
  requirements: []
  hasSignables: any | null
  reason: { type: string; imageUrl: string | null; text: string }
  sortScore: number
  group: string
  info: {
    unitPriceEth: number
  }
  walletMetadata: any
  walletCompleted: any | null
}

export type TArticleDetail = typeof articleDetail

export type TSpindl = typeof spindl
