import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EPage } from '../../../../../ts'

type PageState = {
  page: EPage
  previousPage: EPage
}

const initialPagelState: PageState = {
  page: EPage.DEFAULT,
  previousPage: EPage.DEFAULT
}

const PageSlice = createSlice({
  name: 'Page',
  initialState: initialPagelState,
  reducers: {
    setPage: (state, { payload }: PayloadAction<{ page: EPage }>) => {
      state.previousPage = state.page
      state.page = payload.page
    }
  }
})

export const { setPage } = PageSlice.actions

export default PageSlice.reducer
