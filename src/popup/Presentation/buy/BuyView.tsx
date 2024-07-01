import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/hook'
import OrderCreate from './component/OrderCreate'
import OrderDetail from './component/OrderDetail'
import { useBuyViewModel } from './BuyViewModel'
import { EStatusReact } from '../../../../ts'
import MoonPayWebSdk from '../../../../lib/moonpay.min.js'
import { usePageLoading } from '../../context/LoadingContext.js'

export interface BuyQuote {
  quoteCurrencyPrice: number
  totalAmount: number
  quoteCurrencyCode: string
  quoteCurrencyAmount: number
  feeAmount: number
  networkFeeAmount: number
  baseCurrencyAmount: number
  expiresIn: number
}

export interface Order {
  orderData: Array<{ key: string; value: string }>
  total: number
}

const BuyView = () => {
  const { VITE_MOONPAY_PUBLIC_KEY, VITE_APP_ENVIROMENT, fetchTxStatus, getSignedUrl } =
    useBuyViewModel()
  const { wallet } = useAppSelector((state) => state.wallet)
  const { openMessage } = usePageLoading()

  const [buyQuote, setBuyQuote] = useState<BuyQuote>()
  const [order, setOrder] = useState<Order>()
  const [txStatus, setTxStatus] = useState<EStatusReact>()
  const [txId, setTxId] = useState<string>()

  const onTransactionCompleted = function () {
    // eslint-disable-next-line prefer-rest-params
    const orderDetail = arguments[1]
    if (orderDetail && buyQuote) {
      const tokenCurrency = orderDetail.quoteCurrency.code.toUpperCase()
      const orderData = [
        {
          key: 'Order ID',
          value: orderDetail.id
        },
        {
          key: 'Order Time',
          value: moment(orderDetail.createdAt).format('ddd, MMMM DD | HH:mm A')
        },
        {
          key: 'Payment Method',
          value: 'Debit or Credit'
        },
        {
          key: 'Token Amount',
          value: `${orderDetail.quoteCurrencyAmount} ${tokenCurrency}`
        },
        {
          key: 'Exchange Rate',
          value: `1 ${tokenCurrency} @ $${buyQuote.quoteCurrencyPrice.toFixed(2)}`
        },
        {
          key: '$USD Amount',
          value: `$${orderDetail.baseCurrencyAmount} USD`
        },
        {
          key: 'Total Fees',
          value: `$${Number(orderDetail.feeAmount + orderDetail.networkFeeAmount).toFixed(2)} USD`
        }
      ]
      setOrder({
        orderData: orderData,
        total: buyQuote.totalAmount
      })
      setTxId(orderDetail.id)
    }
  }

  const handleCreateOrder = async () => {
    if (buyQuote) {
      const isProd = VITE_APP_ENVIROMENT === 'PROD'
      const moonpay = MoonPayWebSdk.init
      const moonPaySdk = moonpay({
        flow: 'buy',
        environment: isProd ? 'production' : 'sandbox',
        variant: 'overlay',
        params: {
          apiKey: VITE_MOONPAY_PUBLIC_KEY,
          baseCurrencyCode: 'usd',
          baseCurrencyAmount: buyQuote.totalAmount,
          lockAmount: true,
          currencyCode: buyQuote.quoteCurrencyCode,
          walletAddress: wallet?.account.address
        },
        handlers: {
          onTransactionCompleted: onTransactionCompleted.bind(null, 'onTransactionCompleted')
        },
        debug: !isProd
      })
      const urlForSignature = moonPaySdk.generateUrlForSigning()
      const signature = await getSignedUrl(urlForSignature)
      if (signature) {
        moonPaySdk.updateSignature(signature)
        moonPaySdk.show()
      } else {
        openMessage('error', 'Something wrong!')
      }
    }
  }

  const resetOrderDetail = () => {
    setTxStatus(undefined)
    setTxId(undefined)
    setOrder(undefined)
  }

  const handleViewStatus = () => {
    if (txId) {
      const url = `https://buy-sandbox.moonpay.com/transaction_receipt?transactionId=${txId}`
      window.open(url)
    }
  }

  useEffect(() => {
    if (txId) {
      setTxStatus(EStatusReact.IN_PROGRESS)
      if (order) {
        const orderDataClone = [...order.orderData]
        orderDataClone.splice(0, 1, { key: 'Order ID', value: txId })
        setOrder({
          ...order,
          orderData: orderDataClone
        })
      }
      const intervalId = setInterval(async () => {
        const txData = await fetchTxStatus(txId)
        if (txData.errors) {
          clearInterval(intervalId)
        }
        if (txData.status === 'completed') {
          setTxStatus(EStatusReact.DONE)
          clearInterval(intervalId)
        }
      }, 10000)
    } else setTxStatus(undefined)
  }, [txId])

  return (
    <>
      {order ? (
        <OrderDetail
          onAnother={resetOrderDetail}
          onViewStatus={handleViewStatus}
          order={order}
          status={txStatus}
          txId={txId}
        />
      ) : (
        <OrderCreate buyQuote={buyQuote} setBuyQuote={setBuyQuote} onClick={handleCreateOrder} />
      )}
    </>
  )
}

export default BuyView
