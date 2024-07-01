import { LoadingOutlined } from '@ant-design/icons'
import { switchChain } from '@wagmi/core'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { HexString, TToken } from '../../../../ts/types'
import { _getTokenBalance } from '../../../../utils/w3'
import { _wagmiConfig } from '../../configs/wagmiConfig'
import { usePageLoading } from '../../context/LoadingContext'
import BoxContent from '../component/BoxContent'
import SelectCustom from '../component/SelectCustom'
import { swapType, useData } from '../hook/useData'
import { useGetTokenJson } from '../hook/useGetTokenJson'
import { formatBalance } from '../../../../utils/textConvert'

interface Props {
  swap: swapType
  setPriceUSD?: React.Dispatch<React.SetStateAction<number>>
}

export const USDPrice = ({ swap }: Props) => {
  return <div className="price">${Number(swap.priceUSD).toFixed(2)}</div>
}

const SwapView = () => {
  const {
    gasPrice,
    fetchQuotes,
    setToken,
    setChainFrom,
    chainFrom,
    setGasPrice,
    error,
    txLoading,
    txSuccess,
    setError,
    swapFrom,
    setSwapFrom,
    setSwapTo,
    swapTo,
    routeLoading,
    routeSelect,
    wallet,
    setRoutes,
    executeSwap
  } = useData()
  const [total, setTotal] = useState<number>(0)
  const [debouncedValue, setDebouncedValue] = useState<number>()
  const [balanceData, setBalanceData] = useState<string>()
  const [balanceToData, setBalanceToData] = useState<string>()

  const [listSendToken, setListSendToken] = useState<TToken[]>([])
  const { openMessage, destroyMessage } = usePageLoading()
  const { getJsonToken } = useGetTokenJson({ chain: chainFrom })

  const resetForm = () => {
    setTotal(0)
    setGasPrice('0')
    setSwapFrom({ ...swapFrom, amount: 0, priceUSD: 0 })
    setSwapTo({ ...swapTo, amount: 0, priceUSD: 0 })
    setRoutes([])
  }

  useEffect(() => {
    if (chainFrom) {
      setToken([])
      const listToken = getJsonToken({ chainName: chainFrom.name })
      setListSendToken(listToken)
      //@ts-ignore
      switchChain(_wagmiConfig, { chainId: chainFrom!.id })
    }
  }, [chainFrom])

  useEffect(() => {
    setSwapFrom({ token: listSendToken[0], amount: 0, priceUSD: 0 })
    setSwapTo({ token: listSendToken[1], amount: 0, priceUSD: 0 })
  }, [listSendToken])

  useEffect(() => {
    if (!wallet) return
    if (!swapFrom.token) return
    if (!swapTo.token) return
    if (!chainFrom) return
    if (Number(swapFrom.amount) === 0) return

    if (debouncedValue) {
      fetchQuotes({
        jsonQuote: {
          fromAddress: wallet?.account.address,
          fromAmount: swapFrom.amount.toString(),
          fromChainId: chainFrom.id,
          fromTokenAddress: swapFrom.token.token_symbol,
          toAddress: wallet?.account.address,
          toChainId: chainFrom.id,
          toTokenAddress: swapTo.token.token_symbol
        }
      })
    }
  }, [debouncedValue, swapTo.token])

  useEffect(() => {
    setTotal(Number(gasPrice) + swapFrom.priceUSD)
  }, [gasPrice, swapFrom])

  useEffect(() => {
    if (txSuccess) {
      openMessage('success', 'Success')
      resetForm()
    }
  }, [txSuccess])

  useEffect(() => {
    if (error) {
      destroyMessage()
      openMessage('error', error)
      setError(undefined)
    }
  }, [error])

  useEffect(() => {
    if (swapFrom.amount !== 0) {
      const timer = setTimeout(() => {
        setDebouncedValue(Number(swapFrom.amount))
      }, 500)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [swapFrom])

  useEffect(() => {
    resetForm()
  }, [swapFrom.token])

  useEffect(() => {
    setSwapTo({ ...swapTo, priceUSD: 0, amount: 0 })
    setDebouncedValue(Number(swapFrom.amount))
  }, [swapTo.token])

  useEffect(() => {
    if (wallet && swapFrom.token) {
      _getTokenBalance({
        walletAddress: wallet.account.address as HexString,
        token: swapFrom.token,
        chainId: chainFrom?.id
      }).then((value) => setBalanceData(value))
    }
  }, [swapFrom, txSuccess])

  useEffect(() => {
    if (wallet && swapTo.token) {
      _getTokenBalance({
        walletAddress: wallet.account.address as HexString,
        token: swapTo.token,
        chainId: chainFrom?.id
      }).then((value) => setBalanceToData(value))
    }
  }, [swapTo, txSuccess])

  useEffect(() => {
    const amount = swapFrom.amount
    if (routeSelect && !routeLoading) {
      if (amount === '0' || amount === '') resetForm()
    }
  }, [routeLoading, swapFrom.amount])

  const changeAmountSwapFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '' || e.target.value === '0') {
      resetForm()
    }
    setSwapFrom({ token: swapFrom.token, amount: e.target.value, priceUSD: 0 })
  }

  return (
    <div className="swap-page page col-10 fade-in">
      <BoxContent
        title="Swap tokens"
        subTitle="Trade any tokens, LP share or Vault in a single transaction"
        onConfirm={() => {
          if (wallet && chainFrom && swapFrom.token && swapTo.token) {
            executeSwap()
          }
        }}
        loading={txLoading}
        visibleTotal={total !== 0}
        price={total}
        chainFrom={chainFrom}
        setChainFrom={setChainFrom}
        isError={error !== undefined}
      >
        <div className="send-box box-grey py-3 ps-3 pe-5 mb-2">
          <div>
            <div className="title">Send</div>
            <div className="d-flex gap-3 align-items-center justify-content-between mb-1 position-relative">
              <SelectCustom
                token={swapFrom.token}
                onChange={(e) => {
                  setSwapFrom({ token: e, amount: swapFrom.amount, priceUSD: 0 })
                }}
                listData={listSendToken}
              />
              <input
                className="count"
                type="number"
                value={swapFrom.amount}
                style={{ minWidth: 30, textAlign: 'right', flex: 1 }}
                onChange={changeAmountSwapFrom}
                onWheel={(e) => e.currentTarget.blur()}
                onFocus={() => {
                  if (Number(swapFrom.amount) === 0) {
                    setSwapFrom({ token: swapFrom.token, amount: '', priceUSD: 0 })
                  }
                }}
                onBlur={() => {
                  if (swapFrom.amount === '') {
                    setSwapFrom({ token: swapFrom.token, amount: 0, priceUSD: 0 })
                  }
                }}
              />
            </div>
          </div>
          <div className="d-flex align-items-end justify-content-between">
            <div>
              {balanceData && (
                <div className="status">{`Balance: ${formatBalance(balanceData || '0')}`}</div>
              )}
            </div>
            <div className="price">
              ${Number(swapFrom.priceUSD).toFixed(swapFrom.priceUSD ? 5 : 2)}
            </div>
          </div>
        </div>
        <div className="receive-box box-grey py-3 ps-3 pe-5 mb-2">
          <div>
            <div className="title">Receive</div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <SelectCustom
                token={swapTo.token}
                onChange={(e) => {
                  setSwapTo({ token: e, amount: swapFrom.amount, priceUSD: 0 })
                }}
                listData={listSendToken}
                position="bottom"
              />
              <div className="count d-flex align-items-center gap-3">
                {!routeLoading && <div>{Number(swapTo.amount).toFixed(swapTo.amount ? 5 : 0)}</div>}
                <div className={routeLoading ? 'd-block' : 'd-none'}>
                  {routeLoading && (
                    <Spin
                      indicator={<LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-end justify-content-between">
            <div className="status">
              {balanceToData && (
                <div className="status">{`Balance: ${formatBalance(balanceToData || '0')}`}</div>
              )}
            </div>
            <div className="price">${Number(swapTo.priceUSD).toFixed(swapTo.priceUSD ? 5 : 2)}</div>
          </div>
        </div>
      </BoxContent>
    </div>
  )
}

export default SwapView
