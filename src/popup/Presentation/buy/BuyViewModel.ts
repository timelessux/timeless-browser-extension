import { useState } from 'react'
import BaseService from '../../../../services/axios'
import { useGetTokenJson } from '../hook/useGetTokenJson'
import { TToken } from '../../../../ts/types'
import { WalletConnectRepository } from '../../Domain/Repository'

const apiCountry = 'https://on-ramp-content.metaswap.codefi.network/regions/countries'
const axiosClient = new BaseService()

export type TSupport = {
  buy: boolean
  sell: boolean
  recurringBuy: boolean
}

export type TCountry = {
  currencies?: string[]
  emoji: string
  id: string
  name: string
  states?: TCountry[]
  enableSell: boolean
  support: TSupport
  unsupported: boolean
  recommended?: boolean
}

export const useBuyViewModel = () => {
  const { VITE_MOONPAY_PUBLIC_KEY, VITE_APP_ENVIROMENT } = import.meta.env
  const [currencies, setCurrencies] = useState<TToken[]>()
  const [fetchingBuyQuote, setFetchingBuyQuote] = useState(false)

  const getCountry = async (): Promise<TCountry[]> => {
    const res = await axiosClient.get({ path: apiCountry })
    if (res) return res.data
    return []
  }

  const getSupportedCurrencies = async () => {
    const { getJsonToken } = useGetTokenJson({ chain: undefined })
    const avalanche = getJsonToken({ chainName: 'Avalanche' })
    const ethereum = getJsonToken({ chainName: 'Ethereum' })
    const polygon = getJsonToken({ chainName: 'Polygon' })

    setCurrencies([
      ethereum[0],
      ethereum[63],
      ethereum[22],
      avalanche[0],
      avalanche[11],
      polygon[0]
    ])
  }

  const fetchBuyQuote = async (amount: number, token: string) => {
    try {
      setFetchingBuyQuote(true)
      const url = `https://api.moonpay.com/v3/currencies/${token}/buy_quote?baseCurrencyCode=usd&baseCurrencyAmount=${amount}&apiKey=${VITE_MOONPAY_PUBLIC_KEY}&fixed=true&areFeesIncluded=true&quoteType=principal`
      const res = await fetch(url, {
        method: 'GET'
      })
      return await res.json()
    } catch (error) {
      // console.log(error)
    } finally {
      setFetchingBuyQuote(false)
    }
  }

  const fetchTxStatus = async (txId: string) => {
    const url = `https://api.moonpay.com/v1/transactions/${txId}?apiKey=${VITE_MOONPAY_PUBLIC_KEY}`
    const res = await fetch(url, {
      method: 'GET'
    })
    return await res.json()
  }

  const getSignedUrl = async (url: string) => {
    const walletRepository = WalletConnectRepository(axiosClient)
    const res = await walletRepository.signMoonpayUrl(url)
    if (res.data) return res.data['onRamp'].signMoonpayUrl
    else return false
  }

  return {
    fetchingBuyQuote,
    getCountry,
    fetchBuyQuote,
    currencies,
    getSupportedCurrencies,
    setCurrencies,
    fetchTxStatus,
    VITE_MOONPAY_PUBLIC_KEY,
    VITE_APP_ENVIROMENT,
    getSignedUrl
  }
}
