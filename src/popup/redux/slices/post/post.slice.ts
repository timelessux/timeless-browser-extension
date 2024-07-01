import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EReferenceModule } from '../../../../../ts'

type PostState = {
  error: null
  type: EReferenceModule
}

const initialPostState: PostState = {
  error: null,
  type: EReferenceModule.PUBLIC
}

const postSlice = createSlice({
  name: 'post',
  initialState: initialPostState,
  reducers: {
    setTypePost: (state, { payload }: PayloadAction<{ type: EReferenceModule }>) => {
      state.type = payload.type
    }
  }
})

export const { setTypePost } = postSlice.actions

export default postSlice.reducer
