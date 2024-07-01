import { createAsyncThunk } from '@reduxjs/toolkit'
import { HexString } from '../../../../../ts/types'
import { TokenFile } from '../../../../../utils/mapChains'
import {
  getNativeTokenBalanceRequest,
  getWalletBalanceRequest
} from '../../../services/tokenService'

export const getNativeTokenBalanceThunk = createAsyncThunk(
  'TokenThunk/getNativeTokenBalanceThunk',
  async (
    payload: { walletAddress: HexString; chainId: number },
    { fulfillWithValue, rejectWithValue }
  ) => {
    const { data, error } = await getNativeTokenBalanceRequest(payload)
    if (data) return fulfillWithValue(data)
    return rejectWithValue(error)
  }
)

export const getWalletBalanceThunk = createAsyncThunk(
  'TokenThunk/getWalletBalanceThunk',
  async (
    payload: { walletAddress: HexString; listToken: TokenFile[] },
    { fulfillWithValue, rejectWithValue }
  ) => {
    const { data, error } = await getWalletBalanceRequest(payload)
    if (data) return fulfillWithValue(data)
    return rejectWithValue(error)
  }
)
