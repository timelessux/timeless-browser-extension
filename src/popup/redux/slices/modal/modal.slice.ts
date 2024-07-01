import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EModals } from '../../../../../ts'

type TModalData = {
  name: EModals
  data?: string
}

type ModalState = {
  modalStack: TModalData[] // modal here will be displayed on the screen
  lastModal: TModalData | null
}

const initialModalState: ModalState = {
  modalStack: [],
  lastModal: null
}

const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    // use to open new modal with data by push it to the stack
    pushModal: (state, { payload }: PayloadAction<TModalData>) => {
      const isExistModal = state.modalStack.find((f) => f.name === payload.name)
      if (!isExistModal) {
        state.modalStack.push(payload)
        state.lastModal = payload
      }
      // disableScrollBody();
    },
    // use to close various latest modals
    popModal: (
      state,
      { payload = { counter: 1 } }: PayloadAction<{ counter: number } | undefined>
    ) => {
      state.modalStack = state.modalStack.slice(0, -payload.counter)
      state.lastModal = state.modalStack.length > 0 ? state.modalStack.slice(-1)[0] : null
      // enableScrollBody();
    },
    // use to update modal data that is already shown, do not use to push modal
    updateModalData: (state, { payload }: PayloadAction<TModalData>) => {
      const foundModalDataByName = state.modalStack.find((md) => md.name === payload.name)
      if (foundModalDataByName) {
        foundModalDataByName.data = payload.data
      }
      if (state.lastModal && state.lastModal.name === foundModalDataByName?.name) {
        state.lastModal.data = payload.data
      }
    },
    // clean all the stack
    cleanModalStack: () => initialModalState
  }
})

export const { pushModal, popModal, updateModalData, cleanModalStack } = modalSlice.actions

export default modalSlice.reducer
