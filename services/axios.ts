import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { getData } from '../utils/chromeStorage'

type ServiceInput = {
  path: string
  data?: string
  option?: AxiosRequestConfig<string>
}

const { VITE_AA_API_KEY, VITE_APP_API } = import.meta.env

const request = axios.create({
  baseURL: VITE_APP_API
})

// interceptors

const onRequest = async (config): Promise<InternalAxiosRequestConfig> => {
  const lensProfile = await getData('lensProfile')
  const wallet = await getData('account')

  config = {
    ...config,
    headers: {
      ...{
        'x-wallet-signature': wallet.signature,
        'x-profile-id': lensProfile?.id,
        'x-wallet-address': wallet?.account.address,
        'x-owner-id': wallet?.account.address,
        'x-siwe-message': wallet.siweMessage,
        'x-api-key': VITE_AA_API_KEY
      },
      ...config.headers,
      'Content-type': 'application/json'
    }
  }
  if (config.authenticatedTransform) {
    config = config.authenticatedTransform(config)
  }

  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error.message)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error.message)
}

function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)
  return axiosInstance
}

setupInterceptorsTo(request)

// axios

export default class BaseService {
  async get({ path }: ServiceInput) {
    const response = await request.get(path)
    return response
  }

  async post({ path, data, option }: ServiceInput) {
    const response = await request.post(path, data, option)
    return response
  }

  async put({ path, data }: ServiceInput) {
    const response = await request.put(path, data)
    return response
  }

  async patch({ path, data }: ServiceInput) {
    const response = await request.patch(path, data)
    return response
  }
  async delete({ path }: ServiceInput) {
    const response = await request.delete(path)
    return response
  }
}
