import { Avatar } from 'antd'
import React, { useEffect, useState } from 'react'
import { TToken } from '../../../../../ts/types'
import { getShortAddress } from '../../../../../utils/textConvert'
import CoinbaseIcon from '../../../assets/icons/CoinbaseIcon'
import MoonpayIcon from '../../../assets/icons/MoonpayIcon'
import TransakIcon from '../../../assets/icons/TransakIcon'
import UnlimitedIcon from '../../../assets/icons/UnlimitedIcon'
import { useAppSelector } from '../../../redux/hook'
import { SelectCustomForBuyProvider, SelectCustomForBuyRoute } from '../../component/SelectCustom'
import { useBuyViewModel } from '.././BuyViewModel'
import { convertSecondsToMmSs } from '../../../../../utils/date'
import { BuyQuote } from '../BuyView'
import { usePageLoading } from '../../../context/LoadingContext'
import { SendFrom } from '../../send/SendFrom'

interface Props {
  buyQuote?: BuyQuote
  setBuyQuote: React.Dispatch<BuyQuote | undefined>
  onClick: () => void
}

const timeCountDown = 30

const OrderCreate = ({ buyQuote, setBuyQuote, onClick }: Props) => {
  const { wallet } = useAppSelector((state) => state.wallet)
  const { fetchBuyQuote, getSupportedCurrencies, currencies, fetchingBuyQuote } = useBuyViewModel()
  const { openMessage } = usePageLoading()

  const [assetValue, setAssetValue] = useState<string>('$100')
  const [tokenSelect, setTokenSelect] = useState<TToken>()
  const [debouncedValue, setDebouncedValue] = useState<number>()
  const [seconds, setSeconds] = useState(timeCountDown)

  useEffect(() => {
    getSupportedCurrencies()
  }, [])

  useEffect(() => {
    if (currencies) setTokenSelect(currencies[0])
  }, [currencies])

  useEffect(() => {
    setBuyQuote(undefined)
    setSeconds(timeCountDown)
    if (assetValue !== '$0' && assetValue !== '$') {
      const timer = setTimeout(() => {
        setDebouncedValue(Number(assetValue.replace('$', '')))
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [assetValue])

  useEffect(() => {
    if (tokenSelect) setSeconds(timeCountDown)
  }, [tokenSelect])

  useEffect(() => {
    if (debouncedValue && tokenSelect) {
      const symbol = (tokenSelect.moonpay_symbol ?? tokenSelect.token_symbol).toLowerCase()
      fetchBuyQuote(debouncedValue, symbol).then((res) => {
        if (res.errors && res.message) {
          openMessage('error', res.message)
          return setBuyQuote(undefined)
        }
        setBuyQuote(res)
      })
    }
  }, [debouncedValue, tokenSelect])

  useEffect(() => {
    if (buyQuote && tokenSelect && debouncedValue) {
      const symbol = (tokenSelect.moonpay_symbol ?? tokenSelect.token_symbol).toLowerCase()
      const countdownInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1)
      }, 1000)

      if (seconds <= 0) {
        clearInterval(countdownInterval)
        setSeconds(timeCountDown)

        fetchBuyQuote(debouncedValue, symbol).then((res) => {
          if (res.errors && res.message) {
            openMessage('error', res.message)
            return setBuyQuote(undefined)
          }
          setBuyQuote(res)
        })
      }

      return () => {
        clearInterval(countdownInterval)
      }
    }
  }, [buyQuote, seconds])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetValue(e.target.value)
  }

  const providers = [
    {
      name: 'Moonpay',
      logo: <MoonpayIcon />,
      token: {
        symbol: 'ETH',
        amount: 0
      },
      priceUSD: 0
    },
    {
      name: 'Transak',
      logo: <TransakIcon />,
      token: {
        symbol: 'ETH',
        amount: 0
      },
      priceUSD: 0
    },
    {
      name: 'Unlimited',
      logo: <UnlimitedIcon />,
      token: {
        symbol: 'ETH',
        amount: 0
      },
      priceUSD: 0
    },
    {
      name: 'Coinbase',
      logo: <CoinbaseIcon />,
      token: {
        symbol: 'ETH',
        amount: 0
      },
      priceUSD: 0
    }
  ]

  return (
    <div className="buy-page page fade-in">
      <div className="d-flex p-4 h-100">
        <div className="d-flex flex-column align-items-center gap-5 w-50">
          {/* <button
            type="button"
            className="buy-account-button hover px-2 py-1 d-flex align-items-center"
            style={{
              backgroundColor: '#7474801F'
            }}
          >
            <div className="d-flex align-items-center p-1 gap-2">
              {wallet?.avatar ? <Avatar src={wallet.avatar} size={24} /> : <div>🎈</div>}
              {wallet?.ensName}
              <span style={{ opacity: 0.6 }}>{`(${getShortAddress(
                wallet?.account.address ?? ''
              )})`}</span>
            </div>
          </button> */}
          <SendFrom />
          <input
            className="buy-input"
            value={assetValue}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 80,
              fontFamily: 'Bold',
              textAlign: 'center',
              width: '50%'
            }}
            onChange={(e) => {
              if (e.target.value !== '') {
                handleInputChange(e)
              }
            }}
            onWheel={(e) => e.currentTarget.blur()}
            onFocus={() => {
              if (assetValue === '$0') {
                setAssetValue('$')
              }
            }}
            onBlur={() => {
              if (assetValue === '$') {
                setAssetValue('$0')
              }
            }}
          />
          <div className="choose-price-group px-4 py-2 d-flex gap-2">
            <button
              onClick={() => {
                setAssetValue('$50')
              }}
              className={`${assetValue === '$50' ? '--active' : ''} px-3 py-1 hover`}
            >
              $50
            </button>
            <button
              onClick={() => {
                setAssetValue('$100')
              }}
              className={`${assetValue === '$100' ? '--active' : ''} px-3 py-1 hover`}
            >
              $100
            </button>
            <button
              onClick={() => {
                setAssetValue('$200')
              }}
              className={`${assetValue === '$200' ? '--active' : ''} px-3 py-1 hover`}
            >
              $200
            </button>
          </div>
          <div
            style={{
              width: '80%'
            }}
          >
            {currencies && tokenSelect && (
              <SelectCustomForBuyRoute
                position="top"
                tokenSelect={tokenSelect}
                tokens={currencies}
                onClick={(e) => setTokenSelect(e)}
                buyQuote={buyQuote as BuyQuote}
                fetchingBuyQuote={fetchingBuyQuote}
              />
            )}
          </div>
        </div>
        <div className="d-flex flex-column gap-3 w-50 h-100">
          <span
            style={{
              fontSize: 22,
              fontFamily: 'Heavy'
            }}
          >
            Third Party Providers
          </span>
          <div
            style={{
              width: '80%'
            }}
          >
            <div className="d-flex justify-content-between opacity-75">
              <span style={{ fontSize: 16 }}>Best rates</span>
              {buyQuote && (
                <div className="fade-in d-flex gap-1" style={{ fontSize: 16 }}>
                  <div>New quote in: </div>
                  <div style={{ minWidth: 50 }}>{convertSecondsToMmSs(seconds)}</div>
                </div>
              )}
            </div>
            <SelectCustomForBuyProvider
              available={true}
              provider={providers[0]}
              quote={buyQuote}
              onClick={onClick}
            />
          </div>

          <div
            style={{
              width: '80%'
            }}
          >
            <div className="d-flex justify-content-between opacity-75">
              <span style={{ fontSize: 16 }}>Connect and top up from</span>
            </div>
            <SelectCustomForBuyProvider provider={providers[3]} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCreate
