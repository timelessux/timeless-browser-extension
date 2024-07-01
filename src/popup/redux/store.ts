import createSagaMiddleware from '@redux-saga/core'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appReducer from './reducers'
import myRootSaga from './sagas/rootSaga'

// ...
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['', 'languages']
}
const sagaMiddleware = createSagaMiddleware()

const rootReducer = (state, action) => {
  if (action.type === 'authSlice/logOut')
    return appReducer(
      { ...state, token: { collections: [], nftList: [], walletBalance: '0.00', listToken: [] } },
      action
    )
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false
    }),
    sagaMiddleware
  ],
  devTools: false
})

sagaMiddleware.run(myRootSaga)
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
