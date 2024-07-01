import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { amountToNumber, createAmountFromString, publicActionReverseMirage } from 'reverse-mirage'
import { createPublicClient, encodeFunctionData, http } from 'viem'
import { Chain } from 'wagmi/chains'
import BaseService from '../../../../services/axios'
import { HexString, TRoutes, TToken } from '../../../../ts/types'
import { customChains } from '../../../../utils/mapChains'
import { WalletConnectRepository } from '../../Domain/Repository'
import { usePageLoading } from '../../context/LoadingContext'
import { useAppSelector } from '../../redux/hook'
import { switchWalletNetwork } from '../../redux/slices/wallet/wallet.slice'
import useGetPrice from './useGetPrice'

export interface WalletBalance {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export type TTokenApi = {
  address: string
  chainId: number
  coinKey: string
  decimals: number
  logoURI: string
  name: string
  priceUSD: string
  symbol: string
}

export type swapType = {
  token?: TToken
  amount: string | number
  priceUSD: number
}

const axiosClient = new BaseService()
type Request = {
  fromAddress: string
  fromAmount: string
  fromChainId: number
  fromTokenAddress: string
  toAddress: string
  toChainId: number
  toTokenAddress: string
}

type TransactionRequest = {
  data: `0x${string}`
  to: string
  value: string
  from: string
  chainId: number
  gasPrice?: string
  gasLimit?: string
}

export const useData = () => {
  const [assetValue, setAssetValue] = useState<string>('0')
  const [token, setToken] = useState<TTokenApi[]>([])
  const [gasPrice, setGasPrice] = useState<string>('')
  const [toPrice, setToPrice] = useState<string>('')
  const [toAmmount, setToAmmount] = useState<string>('')
  const [transaction, setTransaction] = useState<TransactionRequest>()
  const [chainSelect, setChainSelect] = useState<Chain>()
  const [chainFrom, _setChainFrom] = useState<Chain>()
  const [routeLoading, setRouteLoading] = useState<boolean>(false)
  const [txLoading, setTxLoading] = useState<boolean>(false)
  const [txSuccess, setTxSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [routes, setRoutes] = useState<TRoutes[]>([])
  const [routeSelect, setRouteSelect] = useState<TRoutes>()
  const [swapFrom, setSwapFrom] = useState<swapType>({ amount: 0, priceUSD: 0 })
  const [swapTo, setSwapTo] = useState<swapType>({ amount: 0, priceUSD: 0 })

  const { cryptoValue: fromPriceUsd, getPriceUsdByToken: getFromPriceUsd } = useGetPrice()
  const { cryptoValue: toPriceUsd, getPriceUsdByToken: getToPriceUsd } = useGetPrice()

  const wallet = useAppSelector((state) => state.wallet.wallet)
  const chain = useAppSelector((state) => state.wallet.chain)

  const dispatch = useDispatch()
  const { openMessage, destroyMessage } = usePageLoading()

  useEffect(() => {
    if (wallet) {
      _setChainFrom(chain)
      const _chainSelect = customChains.find((e) => e.id !== chain.id)
      if (!chainSelect) return setChainSelect(_chainSelect)
      if (chainSelect?.id === chain.id) setChainSelect(_chainSelect)
    }
  }, [chain, chainSelect])

  useEffect(() => {
    if (!chainFrom || !swapFrom.token) return
    getFromPriceUsd(swapFrom.token.coin_symbol, chainFrom.id)
  }, [chainFrom, swapFrom.token])

  useEffect(() => {
    if (!chainFrom || !swapTo.token) return
    getToPriceUsd(swapTo.token.coin_symbol, chainFrom.id)
  }, [chainFrom, swapTo.token])

  const setChainFrom = (chain: Chain) => {
    dispatch(switchWalletNetwork(chain))
  }

  // const fetchRoutes = async ({ jsonRoute }: { jsonRoute: Request }) => {
  //   setRouteLoading(true)
  //   const result = await axiosClient.post({
  //     path: 'https://li.quest/v1/advanced/routes',
  //     data: JSON.stringify(jsonRoute)
  //   })

  //   if (result.data['routes'].length > 0) {
  //     openMessage('success', 'Fetch gas success')
  //     setRoutes(result.data['routes'])
  //     setRouteSelect(result.data.routes[0])
  //     setError(undefined)
  //   } else {
  //     setError('Something wrong...')
  //     setRouteSelect(undefined)
  //     setToPrice('0')
  //   }
  //   setRouteLoading(false)
  // }

  useEffect(() => {
    if (!routeSelect) {
      setToPrice('0')
      return
    }
    // @ts-ignore
    const fromAmount = Number(routeSelect.estimate.fromAmount)
    // @ts-ignore
    const toAmount = Number(routeSelect.estimate.toAmount)
    setSwapFrom({ ...swapFrom, priceUSD: fromAmount * fromPriceUsd })
    setSwapTo({
      ...swapTo,
      amount: toAmount,
      priceUSD: toAmount * toPriceUsd
    })
    setGasPrice('0')
  }, [routeSelect, fromPriceUsd, toPriceUsd])

  const fetchQuotes = async ({ jsonQuote }: { jsonQuote: Request }) => {
    setRouteLoading(true)
    try {
      const result = await WalletConnectRepository(axiosClient).getQuote({
        fromToken: `${jsonQuote.fromChainId}:${jsonQuote.fromTokenAddress}`,
        toToken: `${jsonQuote.toChainId}:${jsonQuote.toTokenAddress}`,
        fromAmount: Number(jsonQuote.fromAmount),
        senderAddress: jsonQuote.fromAddress
      })

      if (result.data && result.data['intentBuilder'].getSwapQuote.items) {
        // @ts-ignore
        setRouteSelect(result.data['intentBuilder'].getSwapQuote.items[0])
        setError(undefined)
      } else {
        setError('Something wrong...')
        setRouteSelect(undefined)
        setToPrice('0')
      }
      setRouteLoading(false)
      if (result?.data?.intentBuilder?.getSwapQuote?.items?.length) return result.data
      return setError('No quotes available')
    } catch (error) {
      setError('No quotes available')
    }
  }

  const executeSwap = async () => {
    setTxLoading(true)
    setTxSuccess(false)
    setError(undefined)
    // @ts-ignore
    const transactionRequest = routeSelect!.data

    // TODO: implement token approval
    const txs = []
    if (swapFrom.token?.address !== '0x0000000000000000000000000000000000000000') {
      const _publicClient = createPublicClient({
        chain: chainFrom,
        transport: http(chainFrom?.rpcUrls?.default?.http?.[0])
      }).extend(publicActionReverseMirage)
      const fromToken = await _publicClient.getERC20({
        erc20: {
          address: swapFrom.token?.address as HexString,
          chainID: chainFrom?.id as number
        }
      })
      const allowance = await _publicClient.getERC20Allowance({
        erc20: fromToken,
        owner: wallet?.account.address as HexString,
        spender: transactionRequest.to
      })
      if (amountToNumber(allowance) < Number(swapFrom.amount)) {
        const { request } = await _publicClient.simulateERC20Approve({
          account: wallet?.account.address as HexString,
          args: {
            amount: createAmountFromString(fromToken, swapFrom.amount.toString()),
            spender: transactionRequest.to
          }
        })
        const { abi, functionName, args } = request
        // approve tx call
        //@ts-ignore
        txs.push({
          to: swapFrom.token?.address,
          data: encodeFunctionData({
            abi,
            functionName,
            args
          }),
          value: 0,
          chainId: chainFrom!.id
        })
      }
    }

    try {
      //@ts-ignore
      txs.push({
        to: transactionRequest.to as HexString,
        data: transactionRequest.callData,
        value: transactionRequest.value,
        chainId: chainFrom!.id,
        gasLimit: transactionRequest.gasLimit
      })

      const txResult = await wallet?.batchTransactions(txs)
      if (txResult && txResult.status == 'SUCCESS') {
        setTxSuccess(true)
        openMessage('success', 'Success!')
      }
    } catch (error) {
      console.log({ error })
      setTxSuccess(false)
      openMessage('error', 'Execute transaction failed!')
    }
    setTxLoading(false)
  }

  return {
    assetValue,
    setAssetValue,
    token,
    gasPrice,
    toPrice,
    toAmmount,
    setToAmmount,
    transaction,
    fetchQuotes,
    setToken,
    setChainSelect,
    chainSelect,
    setChainFrom,
    chainFrom,
    setToPrice,
    setGasPrice,
    setTransaction,
    wallet,
    routeLoading,
    error,
    txLoading,
    txSuccess,
    routes,
    setRoutes,
    setRouteSelect,
    routeSelect,
    setError,
    swapFrom,
    setSwapFrom,
    swapTo,
    setSwapTo,
    executeSwap
  }
}
