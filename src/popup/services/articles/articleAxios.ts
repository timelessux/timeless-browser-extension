import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const { VITE_DAYLIGHT_URL, VITE_DAYLIGHT_TOKEN } = import.meta.env

const axiosInstance = axios.create({
  baseURL: VITE_DAYLIGHT_URL,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

axiosInstance.interceptors.request.use(
  function (config) {
    if (VITE_DAYLIGHT_TOKEN) config.headers.setAuthorization(`Bearer ${VITE_DAYLIGHT_TOKEN}`)
    return config
  },

  function (error) {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },

  function (error) {
    return Promise.reject(error.response.data)
  }
)

type TAxiosRequest<K> = {
  path: string
  header?: AxiosRequestConfig['headers']
  params?: AxiosRequestConfig['params']
  data?: AxiosRequestConfig<K>['data']
}

export const daylightAxiosClient = {
  get: <T, K>(props: TAxiosRequest<K>): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(props.path, {
      params: props.params
    })
  },
  post: <T, K>(props: TAxiosRequest<K>): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(props.path, props.data, {
      headers: { ...props.header },
      params: props.params
    })
  },
  patch: <T, K>(props: TAxiosRequest<K>): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(props.path, props.data, {
      params: props.params
    })
  },
  delete: <T, K>(props: TAxiosRequest<K>): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(props.path, {
      params: props.params
    })
  }
}
