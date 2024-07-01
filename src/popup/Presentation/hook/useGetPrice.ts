import { useState } from 'react'
import { WalletConnectRepository } from '../../Domain/Repository'
import BaseService from '../../../../services/axios'

export default function useGetPrice() {
  const [cryptoValue, setCryptoValue] = useState<number>(0)
  const axiosClient = new BaseService()

  async function getPriceUsdByToken(cryptocurrencys: string, chainId: number) {
    const cryptocurrency = `${chainId}:${cryptocurrencys}`
    setCryptoValue(0)
    const res = await WalletConnectRepository(axiosClient).getTokenPrice([cryptocurrency], 'usd')
    if (res.data) setCryptoValue(Number(res.data['chain'].getTokenPrice[0].price.usd))
  }

  return {
    cryptoValue,
    getPriceUsdByToken
  }
}
