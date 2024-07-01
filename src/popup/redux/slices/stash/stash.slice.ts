import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DataSession = chrome.windows.Window & {
  tabs: chrome.tabs.Tab[]
}

export type StashWindow = {
  stash: DataSession[]
  time: string
  uniqueId: string
}

type StashWindowState = {
  error: null
  dataStashWindow: StashWindow[]
  stashSelected: StashWindow | null
}

const initialStashWindowState: StashWindowState = {
  error: null,
  dataStashWindow: [],
  stashSelected: null
}

const stashWindowSlice = createSlice({
  name: 'stash',
  initialState: initialStashWindowState,
  reducers: {
    setCurrentDataStashWindow: (
      state,
      { payload }: PayloadAction<{ stashWindow: StashWindow[] }>
    ) => {
      state.dataStashWindow = payload.stashWindow
    },

    setStashSelected: (state, { payload }: PayloadAction<{ stashWindow: StashWindow }>) => {
      state.stashSelected = payload.stashWindow
    },

    deleteStash: (state, { payload }: PayloadAction<{ stashWindow: StashWindow }>) => {
      const currentData = state.dataStashWindow
      const newData = currentData.filter((data) => data.uniqueId !== payload.stashWindow.uniqueId)
      state.dataStashWindow = newData
    },

    updateStash: (state, { payload }: PayloadAction<{ stashWindow: StashWindow }>) => {
      const currentData = state.dataStashWindow
      const findIndex = currentData.findIndex(
        (data) => data.uniqueId === payload.stashWindow.uniqueId
      )

      if (findIndex !== -1) {
        currentData[findIndex] = payload.stashWindow
        state.dataStashWindow = currentData
      }
    }
  }
})

export const { setCurrentDataStashWindow, setStashSelected, deleteStash, updateStash } =
  stashWindowSlice.actions

export default stashWindowSlice.reducer
