import { LoadingOutlined } from '@ant-design/icons'
import { Avatar, Button, Spin } from 'antd'
import React from 'react'
import { getShortAddress } from '../../../../../utils/textConvert'
import { useAppSelector } from '../../../redux/hook'
import { Order } from '../BuyView'
import { EStatusReact } from '../../../../../ts'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { AvatarTemp } from '../../../assets/icons/AvatarTemp'

interface Props {
  order: Order
  onPurchase?: () => void
  onAnother: () => void
  onViewStatus: () => void
  status?: EStatusReact
  txId?: string
}

function OrderDetail({ order, onPurchase, onAnother, status, onViewStatus, txId }: Props) {
  const { wallet } = useAppSelector((state) => state.wallet)
  const loading = status === EStatusReact.IN_PROGRESS

  return (
    <div style={{ width: '80%' }} className="buy-page page fade-in">
      <div className="d-flex p-4 h-100 gap-5">
        <div
          style={{ width: '40%' }}
          className="d-flex flex-column align-items-center justify-content-center gap-2"
        >
          {loading && (
            <Spin
              indicator={
                <LoadingOutlined style={{ fontSize: 50, color: '#fff', marginBottom: 10 }} spin />
              }
            />
          )}
          {status === EStatusReact.DONE ? (
            <>
              <div style={{ marginBottom: 10 }}>
                <BsFillCheckCircleFill size={50} color="#30d158" />
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontFamily: 'Heavy'
                }}
              >
                Transaction Complete
              </span>
            </>
          ) : (
            <>
              <span
                style={{
                  fontSize: 22,
                  fontFamily: 'Heavy'
                }}
              >
                {loading ? 'Processing' : 'Purchase'} transaction
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontFamily: 'Medium',
                  opacity: '0.6'
                }}
              >
                {loading
                  ? 'This may take a few minutes to complete'
                  : 'Open MoonPay to complete transaction'}
              </span>
            </>
          )}
          <span
            style={{
              fontSize: 28,
              fontFamily: 'Medium'
            }}
          >
            {order.orderData[3].value}
          </span>
          <span
            style={{
              fontSize: 16,
              fontFamily: 'Medium',
              opacity: '0.6'
            }}
          >
            ${order.total} USD
          </span>
          {txId && (
            <a href={`https://buy-sandbox.moonpay.com/transaction_receipt?transactionId=${txId}`}>
              <span
                style={{
                  fontSize: 16,
                  fontFamily: 'Medium',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                onClick={onViewStatus}
              >
                View order status on MoonPay
              </span>
            </a>
          )}
        </div>
        <div style={{ width: '60%' }} className="d-flex flex-column align-items-center gap-3 h-100">
          <button
            type="button"
            className="buy-account-button hover px-2 py-1 d-flex align-items-center"
            style={{
              backgroundColor: '#7474801F'
            }}
          >
            <div className="d-flex align-items-center p-1 gap-2">
              {wallet.avatar ? <Avatar src={wallet.avatar} size={24} /> : <AvatarTemp />}
              {wallet.ensName}
              <span style={{ opacity: 0.6 }}>{`(${getShortAddress(
                wallet?.account.address
              )})`}</span>
            </div>
          </button>
          <div
            className="w-100 p-4 box-grey"
            style={{
              // backgroundColor: '#7474801F',
              borderRadius: '20px'
            }}
          >
            {order.orderData.map((data) => (
              <div
                key={data.key}
                className="d-flex justify-content-between mb-3 w-100"
                style={{
                  fontSize: 16,
                  opacity: 0.3,
                  color: '#e0e8ff'
                }}
              >
                <div className="w-50" style={{ flex: 1 }}>
                  {data.key}
                </div>
                <div className="w-50 text-end text-break" style={{ flex: 1 }}>
                  {data.value}
                </div>
              </div>
            ))}
            <div
              className="d-flex justify-content-between pt-3 w-100"
              style={{
                fontSize: 16,
                opacity: 0.3,
                borderTop: '1px solid'
              }}
            >
              <div className="w-50">Total</div>
              <div className="w-50 text-end">${order.total.toFixed(2)} USD</div>
            </div>
          </div>
          <div
            className="d-flex align-items-center justify-content-between w-100 p-4"
            style={{
              backgroundColor: '#7474801F',
              borderRadius: '20px'
            }}
          >
            <div
              style={{
                fontSize: 16,
                opacity: 0.3
              }}
            >
              Purchase another?
            </div>
            <Button
              type="primary"
              shape="round"
              className="d-flex align-items-center justify-content-center w-50 p-4"
              onClick={onAnother}
              loading={loading}
            >
              PURCHASE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
