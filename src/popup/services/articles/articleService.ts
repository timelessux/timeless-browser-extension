import { TArticle, TArticleDetail, TArticleTransaction } from './../../../../ts/articleState'
import { ARTICLE_SECTION } from './../../constants/article'
import { daylightAxiosClient } from './articleAxios'

export const getListArticleRequest = async (
  address: string
): Promise<{ data: TArticle[]; error?: string }> => {
  try {
    const params = new URLSearchParams()
    params.set('count', '10')
    params.append('section', ARTICLE_SECTION.MINT)
    params.append('section', ARTICLE_SECTION.CLAIM)
    params.append('section', ARTICLE_SECTION.ARTICLES_FOR_YOU)
    params.append('section', ARTICLE_SECTION.CREATORS_LIKED)
    params.append('section', ARTICLE_SECTION.POPULAR_CREATORS)
    params.append('section', ARTICLE_SECTION.QUESTS_FOR_YOU)
    params.append('section', ARTICLE_SECTION.SOCIAL)
    params.append('section', ARTICLE_SECTION.TRENDING_INFLUENCERS)
    params.append('section', ARTICLE_SECTION.TRENDING_MINTS)
    params.append('section', ARTICLE_SECTION.VOTE)

    const { data } = await daylightAxiosClient.get<{ sections: TArticle[] }, any>({
      path: `addresses/${address}/explore`,
      params
    })

    if (data.sections) return { data: data.sections }
    return { data: [] }
  } catch (error) {
    return error?.error
  }
}

export const getListArticleByTypeRequest = async (
  address: string,
  type: string
): Promise<{ data?: TArticleTransaction[]; error?: string }> => {
  try {
    const params = new URLSearchParams()
    params.set('limit', '90')
    params.set('type', type)
    params.set('sort', 'magic')
    params.set('sortDirection', 'desc')
    params.set('showOpenMints', 'true')
    params.set('markAsShown', 'false')

    const { data } = await daylightAxiosClient.get<
      { status: 'string'; abilities: TArticleTransaction[] },
      any
    >({
      path: `addresses/${address}/transactions`,
      params
    })

    if (data.abilities.length) return { data: data.abilities }
    return { data: undefined }
  } catch (error) {
    return error?.error
  }
}

export const getArticleById = async (
  address: string,
  articleId: string
): Promise<{ data?: TArticleDetail; error?: string }> => {
  try {
    const params = new URLSearchParams()
    params.set('markAsShown', 'true')
    params.set('showSignables', 'true')

    const { data } = await daylightAxiosClient.get<TArticleDetail, any>({
      path: `addresses/${address}/transaction/${articleId}`,
      params
    })

    if (data) return { data }
    return { data: undefined }
  } catch (error) {
    return error?.error
  }
}
