/* eslint-disable @typescript-eslint/ban-ts-comment */
import { signMessage, signTypedData } from '@wagmi/core'
import BaseService from '../services/axios'
import { GraphQLResponse, WalletConnectResponse } from '../src/popup/Domain/Model'
import { WalletConnectRepository } from '../src/popup/Domain/Repository'
import { EStatusReact } from '../ts'
import { _wagmiConfig } from '../src/popup/configs/wagmiConfig'

export async function walletConnectWrapper(
  callback: Promise<GraphQLResponse<WalletConnectResponse>>,
  name: string
): Promise<GraphQLResponse<WalletConnectResponse>> {
  const axiosClient = new BaseService()
  const res = await callback

  if (res.data) {
    if (res.data[name].status === EStatusReact.IN_PROGRESS) {
      const requestId = res.data[name].id
      const typeData = res.data[name].nextStep?.params
      const method = res.data[name].nextStep?.method
      if (!typeData) return res
      else {
        let signature
        if (method === 'eth_signTypedData')
          signature = await signTypedData(_wagmiConfig, JSON.parse(typeData[0]))
        else signature = await signMessage(_wagmiConfig, { message: typeData[0] })
        if (requestId) {
          const wcResponse = await WalletConnectRepository(axiosClient).request(
            requestId,
            signature
          )
          return wcResponse
        }
      }
    }
  }
  return res
}

export const removeDuplicateObjects = <T>(array: T[], property: string) => {
  const uniqueIds = []
  const unique = array.filter((element) => {
    const isDuplicate = uniqueIds.includes(element[property] as never)
    if (!isDuplicate) {
      uniqueIds.push(element[property] as never)
      return true
    }
    return false
  })
  return unique
}

export const isProduction = () => {
  //@ts-ignore
  const { VITE_APP_ENVIROMENT } = import.meta.env
  return VITE_APP_ENVIROMENT === 'PROD'
}
