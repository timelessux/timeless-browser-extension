import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TArticle, TArticleDetail, TArticleState } from '../../../../../ts/articleState'
import { ARTICLE_DISPLAY_VIEW, ARTICLE_SECTION } from '../../../constants/article'
import { RootState } from '../../store'
import {
  getArticleByIdThunk,
  getListArticleByTypeThunk,
  getListArticleThunk,
  getListSpindlThunk
} from './articleThunk'

const initialState: TArticleState = {
  isCollapse: false
}

export const ArticleSlice = createSlice({
  name: 'ArticleSlice',
  initialState,
  reducers: {
    setPreviousView: (state, action: PayloadAction<ARTICLE_DISPLAY_VIEW>) => {
      state.previousView = action.payload
    },
    setCurrentView: (state, action: PayloadAction<ARTICLE_DISPLAY_VIEW>) => {
      state.currentView = action.payload
    },

    setArticleType: (state, action: PayloadAction<Omit<TArticle, 'transactions'>>) => {
      state.articleType = action.payload
    },

    setArticleId: (state, action: PayloadAction<string>) => {
      state.articleId = action.payload
    },

    setArticleDetail: (state, action: PayloadAction<TArticleDetail>) => {
      state.articleDetail = action.payload
    },

    setIsCollapse: (state, action: PayloadAction<boolean>) => {
      state.isCollapse = action.payload
    }
  },
  extraReducers: (builder) => {
    /** GET LIST ARTICLE */
    builder.addCase(getListArticleThunk.pending, (state) => {
      state.fetchingListArticle = true
    })
    builder.addCase(getListArticleThunk.fulfilled, (state, action) => {
      state.articleForYou = action.payload.find((e) => e.key === ARTICLE_SECTION.ARTICLES_FOR_YOU)
      state.mint = action.payload.find((e) => e.key === ARTICLE_SECTION.MINT)
      state.popularCreators = action.payload.find((e) => e.key === ARTICLE_SECTION.POPULAR_CREATORS)
      state.questsForYou = action.payload.find((e) => e.key === ARTICLE_SECTION.QUESTS_FOR_YOU)
      state.trendingMints = action.payload.find((e) => e.key === ARTICLE_SECTION.TRENDING_MINTS)
      state.trendingInfluencers = action.payload.find(
        (article) => article.key === ARTICLE_SECTION.TRENDING_INFLUENCERS
      )

      state.fetchingListArticle = false
      state.errorFetchListArticle = undefined
    })
    builder.addCase(getListArticleThunk.rejected, (state, action) => {
      state.fetchingListArticle = false
      state.errorFetchListArticle = action.payload as string
    })

    /** GET LIST ARTICLE BY TYPE */
    builder.addCase(getListArticleByTypeThunk.pending, (state) => {
      state.fetchingListArticleByType = true
    })
    builder.addCase(getListArticleByTypeThunk.fulfilled, (state, action) => {
      state.listArticleByType = action.payload
      state.fetchingListArticleByType = false
      state.errorFetchListArticleByType = undefined
    })
    builder.addCase(getListArticleByTypeThunk.rejected, (state, action) => {
      state.fetchingListArticleByType = false
      state.errorFetchListArticleByType = action.payload as string
    })

    /** GET ARTICLE BY ID */
    builder.addCase(getArticleByIdThunk.pending, (state) => {
      state.fetchingArticleById = true
    })
    builder.addCase(getArticleByIdThunk.fulfilled, (state, action) => {
      state.articleDetail = action.payload
      state.fetchingArticleById = false
      state.errorFetchArticleById = undefined
    })
    builder.addCase(getArticleByIdThunk.rejected, (state, action) => {
      state.fetchingArticleById = false
      state.errorFetchArticleById = action.payload as string
    })

    /** GET TRENDING DAPP */
    builder.addCase(getListSpindlThunk.pending, (state) => {
      state.fetchingListSpindl = true
    })
    builder.addCase(getListSpindlThunk.fulfilled, (state, action) => {
      state.trendingDApp = action.payload
      state.errorFetchListSpindl = undefined
      state.fetchingListSpindl = false
    })
    builder.addCase(getListSpindlThunk.rejected, (state, action) => {
      state.fetchingListSpindl = false
      state.errorFetchListSpindl = action.payload as string
    })
  }
})

export const articleActions = ArticleSlice.actions
export const selectArticleState = (state: RootState) => state.articleState
export default ArticleSlice.reducer
