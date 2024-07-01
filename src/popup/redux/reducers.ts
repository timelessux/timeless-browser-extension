import { combineReducers } from '@reduxjs/toolkit'
import modalSlice from './slices/modal/modal.slice'
import postSlice from './slices/post/post.slice'
import walletSlice from './slices/wallet/wallet.slice'
import slideSlice from './slices/slide/slide.slice'
import socialPostSlice from './slices/social-post/social-post.slice'
import stashSlice from './slices/stash/stash.slice'
import tokenSlice from './slices/token/token.slice'
import tokenSettingSlice from './slices/token-setting/token-setting.slice'
import tutorialSlice from './slices/tutorial/tutorial.slice'
import conversationSlice from './conversation/conversation.slice'
import exploreSlice from './slices/explore/exploreSlice'
import authSlice from './slices/auth/authSlice'
import articleSlice from './slices/articles/articleSlice'
import pageSlice from './slices/pages/pageSlice'

const rootReducers = combineReducers({
  authState: authSlice,
  modal: modalSlice,
  wallet: walletSlice,
  slide: slideSlice,
  conversation: conversationSlice,
  socialPost: socialPostSlice,
  post: postSlice,
  stash: stashSlice,
  token: tokenSlice,
  tokenSetting: tokenSettingSlice,
  tutorial: tutorialSlice,
  exploreState: exploreSlice,
  articleState: articleSlice,
  pageSlice: pageSlice
})

export default rootReducers
