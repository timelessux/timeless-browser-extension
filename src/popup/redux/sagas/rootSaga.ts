import { all } from 'redux-saga/effects'
import WalletSaga from './walletSaga'
import TokenSettingSaga from './tokenSettingSaga'

export default function* myRootSaga() {
  yield all([WalletSaga(), TokenSettingSaga()])
}