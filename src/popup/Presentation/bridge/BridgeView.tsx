import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { parseEther } from 'viem'
import { HexString, TToken } from '../../../../ts/types'
import { _getTokenBalance } from '../../../../utils/w3'
import { usePageLoading } from '../../context/LoadingContext'
import BoxContent from '../component/BoxContent'
import SelectCustom from '../component/SelectCustom'
import { useData } from '../hook/useData'
import { useGetTokenJson } from '../hook/useGetTokenJson'
import { USDPrice } from '../swap/SwapView'
import { formatBalance } from '../../../../utils/textConvert'

const BridgeView = () => {
  const {
    fetchRoutes,
    gasPrice,
    fetchQuotes,
    setToken,
    chainSelect,
    setChainSelect,
    chainFrom,
    setChainFrom,
    setGasPrice,
    setTransaction,
    txSuccess,
    error,
    txLoading,
    routes,
    setRoutes,
    routeLoading,
    routeSelect,
    setRouteSelect,
    swapFrom,
    swapTo,
    setSwapFrom,
    setSwapTo,
    wallet
  } = useData()

  const { openMessage, destroyMessage } = usePageLoading()
  const [total, setTotal] = useState<number>(0)
  const [listSendToken, setListSendToken] = useState<TToken[]>([])
  const [listFromToken, setListFromToken] = useState<TToken[]>([])
  const [debouncedValue, setDebouncedValue] = useState<number>()
  const [balanceData, setBalanceData] = useState<string>()
  const [balanceToData, setBalanceToData] = useState<string>()

  const { getJsonToken } = useGetTokenJson({ chain: chainFrom })

  const resetForm = () => {
    setTotal(0)
    setGasPrice('0')
    setTransaction(undefined)
    setRoutes([])
    setSwapTo({ ...swapTo, amount: 0, priceUSD: 0 })
    setSwapFrom({ ...swapFrom, amount: 0, priceUSD: 0 })
    setRouteSelect(undefined)
  }

  useEffect(() => {
    if (wallet && swapFrom.token) {
      _getTokenBalance({
        walletAddress: wallet.account.address as HexString,
        token: swapFrom.token,
        chainId: chainFrom?.id
      }).then((value) => setBalanceData(value))
    }
  }, [swapFrom.token, wallet])

  useEffect(() => {
    if (wallet && swapTo.token) {
      _getTokenBalance({
        walletAddress: wallet.account.address as HexString,
        token: swapTo.token,
        chainId: chainSelect?.id
      }).then((value) => setBalanceToData(value))
    }
  }, [swapTo.token, wallet])

  useEffect(() => {
    if (chainFrom && chainSelect) {
      setToken([])
      const listToken: Array<TToken> = getJsonToken({ chainName: chainFrom.name })
      const listFromToken: Array<TToken> = getJsonToken({ chainName: chainSelect.name })
      setListSendToken(listToken)
      setListFromToken(listFromToken)
      setTotal(0)
      setGasPrice('0')
      setRoutes([])
    }
  }, [chainFrom, chainSelect])

  useEffect(() => {
    setSwapFrom({ token: listSendToken[0], amount: 0, priceUSD: 0 })
  }, [listSendToken])

  useEffect(() => {
    setSwapTo({ token: listFromToken[0], amount: 0, priceUSD: 0 })
  }, [listFromToken])

  useEffect(() => {
    if (swapFrom.amount !== 0 && swapFrom.amount !== '') {
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
    setSwapFrom({ ...swapFrom, amount: 0, priceUSD: 0 })
  }, [swapFrom.token])

  useEffect(() => {
    setSwapTo({ ...swapTo, priceUSD: 0, amount: 0 })
    setDebouncedValue(Number(swapFrom.amount))
  }, [swapTo.token])

  useEffect(() => {
    setRoutes([])
    if (!wallet) return
    if (!swapFrom.token) return
    if (!swapTo.token) return
    if (!chainFrom) return
    if (Number(swapFrom.amount) === 0) return
    if (!chainSelect) return

    if (debouncedValue) {
      fetchRoutes({
        jsonRoute: {
          fromAddress: wallet?.account.address,
          fromAmount: parseEther(swapFrom.amount.toString()).toString(),
          fromChainId: chainFrom.id,
          fromTokenAddress: swapFrom.token.address,
          toAddress: wallet?.account.address,
          toChainId: chainSelect.id,
          toTokenAddress: swapTo.token.address
        }
      })
    }
  }, [debouncedValue, swapTo.token])

  useEffect(() => {
    if (txSuccess) {
      openMessage('success', 'Success')
      resetForm()
    }
  }, [txSuccess])

  useEffect(() => {
    if (error) {
      destroyMessage()
      openMessage('error', `${error}`)
    }
  }, [error])

  useEffect(() => {
    const amount = swapFrom.amount
    if (routes.length > 0 && !routeLoading) {
      if (amount === '0' || amount === '') resetForm()
    }
  }, [routeLoading, swapFrom.amount])

  useEffect(() => {
    let totalAmmountGas = 0
    if (routes.length > 0 && routeSelect) {
      routeSelect.steps.map((step) => {
        if (step.estimate.feeCosts.length > 0) {
          step.estimate.feeCosts.map((cost) => (totalAmmountGas += Number(cost.amountUSD)))
        }
      })
      totalAmmountGas = Number(routeSelect.gasCostUSD) + swapFrom.priceUSD
    }
    setTotal(totalAmmountGas)
  }, [routes, routeSelect, swapFrom.priceUSD])

  const changeAmmountSwapFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      resetForm()
    }
    setSwapFrom({ token: swapFrom.token, amount: e.target.value, priceUSD: 0 })
  }

  return (
    <div className="bridge-page page col-10 fade-in">
      <BoxContent
        title="Bridge tokens"
        subTitle="Transfer your tokens from one network to another."
        isVisibleNewNetwork
        onConfirm={() => {
          if (wallet && chainFrom && chainSelect && swapFrom.token && swapTo.token)
            fetchQuotes({
              jsonQuote: {
                fromAddress: wallet?.account.address,
                fromAmount: swapFrom.amount.toString(),
                fromChainId: chainFrom.id,
                fromTokenAddress: swapFrom.token.token_symbol,
                toAddress: wallet?.account.address,
                toChainId: chainSelect.id,
                toTokenAddress: swapTo.token.token_symbol
              }
            })
        }}
        loading={txLoading}
        visibleTotal={total !== 0}
        price={total}
        chainBridge={chainSelect}
        setChainBridge={setChainSelect}
        gasPrice={Number(gasPrice)}
        chainFrom={chainFrom}
        setChainFrom={setChainFrom}
        isError={error !== undefined}
        routes={routes}
        routeSelect={routeSelect}
        setRouteSelect={setRouteSelect}
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
                style={{ minWidth: 30, maxWidth: 'max-content', textAlign: 'right' }}
                onChange={changeAmmountSwapFrom}
                onWheel={(e) => e.currentTarget.blur()}
                onFocus={() => {
                  if (Number(swapFrom.amount) === 0) {
                    setSwapFrom({ token: swapFrom.token, amount: '', priceUSD: 0 })
                  }
                }}
                onBlur={() => {
                  if (swapFrom.amount === '') {
                    setSwapFrom({ token: swapFrom.token, amount: '0', priceUSD: 0 })
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
            <USDPrice swap={swapFrom} />
          </div>
        </div>
        <div className="receive-box box-grey py-3 ps-3 pe-5 mb-2">
          <div>
            <div className="title">Receive</div>
            <div className="d-flex align-items-center justify-content-between">
              <SelectCustom
                token={swapTo.token}
                onChange={(e) => {
                  setSwapTo({ token: e, amount: swapTo.amount, priceUSD: 0 })
                }}
                listData={listFromToken}
                position="bottom"
              />
              <div className="count d-flex align-items-center gap-3">
                {!routeLoading && <div>{Number(swapTo.amount) !== 0 || 0}</div>}
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
            <USDPrice swap={swapTo} />
          </div>
        </div>
      </BoxContent>
    </div>
  )
}

export default BridgeView
