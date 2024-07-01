import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SlideState = {
  isVisibleMenuSideBar: boolean
  isVisibleHeader: boolean
  error: null
}

const initialSlidelState: SlideState = {
  isVisibleMenuSideBar: false,
  isVisibleHeader: true,
  error: null
}

const SlideSlice = createSlice({
  name: 'slide',
  initialState: initialSlidelState,
  reducers: {
    setVisibleMenuSideBar: (
      state,
      { payload }: PayloadAction<{ isVisibleMenuSideBar: boolean }>
    ) => {
      state.isVisibleMenuSideBar = payload.isVisibleMenuSideBar
    },

    setVisibleHeader: (state, { payload }: PayloadAction<{ isVisibleHeader: boolean }>) => {
      state.isVisibleHeader = payload.isVisibleHeader
    }
  }
})

export const { setVisibleMenuSideBar, setVisibleHeader } = SlideSlice.actions

export default SlideSlice.reducer
