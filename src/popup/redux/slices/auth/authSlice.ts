import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {},
  reducers: {
    logOut: () => {}
  }
})

export const authActions = authSlice.actions
export default authSlice.reducer
