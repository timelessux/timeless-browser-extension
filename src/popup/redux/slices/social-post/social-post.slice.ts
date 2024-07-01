import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ETypePost } from '../../../../../ts'

type SocialPostState = {
  error: null
  type: ETypePost
  isExpanded: boolean
  isPostCreated: boolean
}

const initialSocialPostState: SocialPostState = {
  error: null,
  type: ETypePost.FOR_YOU,
  isExpanded: false,
  isPostCreated: false
}

const socialPostSlice = createSlice({
  name: 'socialPost',
  initialState: initialSocialPostState,
  reducers: {
    setTypeSocialPost: (state, { payload }: PayloadAction<{ type: ETypePost }>) => {
      state.type = payload.type
    },

    setExpanded: (state, { payload }: PayloadAction<{ isExpanded: boolean }>) => {
      state.isExpanded = payload.isExpanded
    },
    setPostCreated: (state, { payload }: PayloadAction<{ isPostCreated: boolean }>) => {
      state.isPostCreated = payload.isPostCreated
    }
  }
})

export const { setTypeSocialPost, setExpanded, setPostCreated } = socialPostSlice.actions

export default socialPostSlice.reducer
