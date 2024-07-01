import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getArticleById,
  getListArticleByTypeRequest,
  getListArticleRequest
} from './../../../services/articles/articleService'
import { getListSpindlRequest } from '../../../services/spindl/spindlServices'

export const getListArticleThunk = createAsyncThunk(
  'ArticleThunk/getListArticleThunk',
  async (payload: string, { fulfillWithValue, rejectWithValue }) => {
    const { data, error } = await getListArticleRequest(payload)
    if (data) return fulfillWithValue(data)
    return rejectWithValue(error)
  }
)

export const getListArticleByTypeThunk = createAsyncThunk(
  'ArticleThunk/getListArticleByTypeThunk',
  async (payload: { address: string; type: string }, { fulfillWithValue, rejectWithValue }) => {
    const { data, error } = await getListArticleByTypeRequest(payload.address, payload.type)
    if (data) return fulfillWithValue(data)
    return rejectWithValue(error)
  }
)

export const getArticleByIdThunk = createAsyncThunk(
  'ArticleThunk/getArticleByIdThunk',
  async (
    payload: { address: string; articleId: string },
    { fulfillWithValue, rejectWithValue }
  ) => {
    const { data, error } = await getArticleById(payload.address, payload.articleId)
    if (data) return fulfillWithValue(data)
    return rejectWithValue(error)
  }
)

export const getListSpindlThunk = createAsyncThunk(
  'ArticleThunk/getListSpindlThunk',
  async (payload:{address:string}, { fulfillWithValue, rejectWithValue }) => {
    const { data, error } = await getListSpindlRequest({address: payload.address})
    if (data) return fulfillWithValue(data)
    return rejectWithValue(error)
  }
)
