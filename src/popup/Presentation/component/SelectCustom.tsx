import React, { useRef, useState } from 'react'
import { BsFillFuelPumpFill } from 'react-icons/bs'
import { RxCountdownTimer } from 'react-icons/rx'
import { Chain } from 'wagmi/chains'
import { TRoutes, TToken } from '../../../../ts/types'
import { MyChain, getChainById } from '../../../../utils/mapChains'
import { ArrowDownCircleIcon } from '../../assets/icons/arrowDownCircle'
import { BuyQuote } from '../buy/BuyView'
import useClickOutside from '../hook/useClickOutside'
import Avatar from './Avatar'

//@ts-ignore
import BuyCoinIcon from '../../assets/icons/bitcoin.png'
//@ts-ignore
import BuyCurrencyIcon from '../../assets/icons/currency.png'
import { ArrowUpRightCircle } from '../../assets/icons/arrowUpRightCircle'

const SelectCustom = ({
  listData,
  onChange,
  token,
  className,
  sizeImage = 48,
  removeToken,
  position = 'top'
}: {
  listData?: TToken[]
  token?: TToken | null
  onChange?: (e: TToken) => void
  className?: string
  sizeImage?: number
  removeToken?: TToken | null
  position?: 'bottom' | 'top'
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside({ insideRef: ref, action: () => setOpen(false) })

  return (
    <div
      className={`select-custom position-relative ${className ? className : ''}`}
      ref={ref}
      onMouseEnter={() => {
        setOpen(true)
      }}
      onMouseLeave={() => {
        setOpen(false)
      }}
    >
      <div className="d-flex gap-2 align-items-center mb-1 px-0 py-1">
        <Avatar size={sizeImage} src={`${token?.logoURI}`} radius={'50%'} />
        <span className="coin-name align-middle">{token?.coin_symbol}</span>
        {onChange && <ArrowDownCircleIcon />}
      </div>

      <div
        className={`position-absolute px-3 py-2 w-100 select-absolute background-box hidden-scroll-bar 
          ${open ? '--open' : ''} ${position === 'top' ? 'top-100' : ''} 
          ${position === 'bottom' ? 'bottom-100' : ''}`}
      >
        {listData?.map((itemToken, idx) => {
          if (removeToken?.coin_symbol === itemToken.coin_symbol) return null
          const url = `${itemToken.logoURI}`
          return (
            <div
              className="item-option px-2 py-3 d-flex gap-3 align-items-center"
              onClick={() => {
                if (onChange) {
                  onChange(itemToken)
                  setOpen(!open)
                }
              }}
              key={idx}
            >
              <Avatar size={24} src={url} radius={'50%'} />
              <span className="align-middle">{itemToken.coin_symbol}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SelectCustom

export const SelectCustomForNetwork = ({
  listData,
  onChange,
  chainSelect,
  className
}: {
  listData?: MyChain[]
  chainSelect?: Chain
  onChange: (e: MyChain) => void
  className?: string
  networkId?: string | number
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside({ insideRef: ref, action: () => setOpen(false) })

  return (
    <div
      className={`select-custom position-relative ${className ? className : ''}`}
      ref={ref}
      onMouseEnter={() => {
        setOpen(true)
      }}
      onMouseLeave={() => {
        setOpen(false)
      }}
    >
      <div className="box-grey px-3 py-2 d-flex align-items-center gap-2">
        <Avatar size={48} src={chainSelect?.logo} className="hover" radius={'50%'} />
        <span className="coin-name align-middle">{chainSelect?.name}</span>
        <div className={`${open ? '' : ''}`}>
          <ArrowDownCircleIcon />
        </div>
      </div>
      <div className={`position-absolute top-100 w-100`} style={{ zIndex: 1000 }}>
        <div
          className={`mt-1 px-3 py-2 background-box select-absolute  hidden-scroll-bar ${
            open ? '--open' : ''
          }`}
        >
          {listData?.map((chainItem) => {
            return (
              <div
                className="item-option px-2 py-3 d-flex gap-3 align-items-center"
                onClick={() => {
                  onChange(chainItem), setOpen(!open)
                }}
                key={chainItem.id}
              >
                <Avatar size={24} src={chainItem.logo} radius={'50%'} />
                <span className="align-middle">{chainItem.name || ''}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const SelectCustomForRoute = ({
  routes,
  onChange,
  routeSelect,
  className,
  position = 'top'
}: {
  routes?: TRoutes[]
  routeSelect: TRoutes
  onChange?: (e: TRoutes) => void
  className?: string
  position?: 'bottom' | 'top'
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside({ insideRef: ref, action: () => setOpen(false) })

  return (
    <div
      className={`select-custom position-relative ${className ? className : ''}`}
      ref={ref}
      onMouseEnter={() => {
        setOpen(true)
      }}
      onMouseLeave={() => {
        setOpen(false)
      }}
    >
      <div className="bridge-box box-grey p-4 d-flex align-items-center justify-content-between">
        <div className="d-flex gap-4">
          <Avatar
            size={48}
            src={`${routeSelect.steps[0].toolDetails.logoURI}`}
            radius={'50%'}
            background="#F8C8DC"
          />
          <div className="info">
            <div className="title">{routeSelect.steps[0].toolDetails.name}</div>
            <div className="status px-2 py-1 d-flex gap-1 align-items-center">
              <RxCountdownTimer />
              <div>~{(routeSelect.steps[0].estimate.executionDuration / 60).toFixed(0)} mins</div>
              <BsFillFuelPumpFill className="ms-2" />
              <div>~${Number(routeSelect.gasCostUSD)}</div>
            </div>
          </div>
        </div>
        <div>
          <ArrowDownCircleIcon />
        </div>
      </div>
      <div
        className={`position-absolute px-3 py-2 w-100 select-absolute background-box hidden-scroll-bar ${
          open ? '--open' : ''
        } ${position === 'top' ? 'bottom-100' : ''} ${position === 'bottom' ? 'top-100' : ''}`}
      >
        {routes?.map((route) => {
          return (
            <div
              key={route.id}
              className="bridge-box p-4 d-flex align-items-center justify-content-between"
              onClick={() => {
                onChange && onChange(route)
                setOpen(!open)
              }}
            >
              <div className="d-flex gap-4">
                <Avatar
                  size={48}
                  src={`${route.steps[0].toolDetails.logoURI}`}
                  radius={'50%'}
                  background="#F8C8DC"
                />
                <div className="info">
                  <div className="title">{route.steps[0].toolDetails.name}</div>
                  <div className="status px-2 py-1 d-flex gap-1 align-items-center">
                    <RxCountdownTimer />
                    <div
                      style={{
                        minWidth: 100,
                        maxWidth: 100,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      ~{(route.steps[0].estimate.executionDuration / 60).toFixed(0)} mins
                    </div>
                    <BsFillFuelPumpFill className="ms-2" />
                    <div>~${Number(route.gasCostUSD)}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const SelectCustomForBuyRoute = ({
  tokenSelect,
  className,
  tokens,
  onClick,
  buyQuote,
  fetchingBuyQuote
}: {
  tokenSelect: TToken
  tokens: Array<TToken>
  onClick?: (e: TToken) => void
  className?: string
  position?: 'bottom' | 'top'
  buyQuote: BuyQuote
  fetchingBuyQuote: boolean
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside({ insideRef: ref, action: () => setOpen(false) })

  return (
    <div
      className={`select-custom position-relative ${className ? className : ''}`}
      ref={ref}
      onMouseEnter={() => {
        setOpen(true)
      }}
      onMouseLeave={() => {
        setOpen(false)
      }}
    >
      <div className="bridge-box box-grey p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex gap-4 align-items-center">
          <Avatar size={48} src={tokenSelect?.logoURI} radius={'50%'} background="#F8C8DC" />
          <div className="info d-flex flex-column gap-1">
            <div className="title">{getChainById(tokenSelect.chainId ?? 1)?.name} Network</div>
            <div>{tokenSelect.name}</div>
            {(!buyQuote || fetchingBuyQuote) && (
              <div
                className="skeleton-loader"
                style={{ height: 26, borderRadius: 20, width: 110 }}
              />
            )}
            {!fetchingBuyQuote && buyQuote && (
              <div
                className="d-flex gap-1 px-3 align-items-center"
                style={{
                  width: 'fit-content',
                  // border: '1px solid',
                  borderRadius: '20px',
                  borderColor: '#ffffff90',
                  backgroundColor: '#ffffff0D'
                }}
              >
                <BsFillFuelPumpFill />
                <div>~${Number(buyQuote.feeAmount + buyQuote.networkFeeAmount).toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
        <div>
          <ArrowDownCircleIcon />
        </div>
      </div>
      <div
        style={{ backgroundColor: '#8e8882' }}
        className={`position-absolute px-3 py-2 w-100 select-absolute hidden-scroll-bar bottom-100 
          ${open ? '--open' : ''}`}
      >
        {tokens?.map((token) => {
          return (
            <div
              className="item-option special-item-option px-1 py-2 d-flex gap-3 align-items-center"
              key={token.coingecko_token_id + token.address}
              onClick={() => {
                onClick?.(token)
                setOpen(false)
              }}
            >
              <div className="d-flex gap-4 align-items-center">
                <Avatar size={48} src={token.logoURI} radius={'50%'} background="#F8C8DC" />
                <div className="info d-flex flex-column gap-1">
                  <div className="title">{getChainById(token.chainId ?? 1)?.name} Network</div>
                  <div>{token.name}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const SelectCustomForBuyProvider = ({
  provider,
  className,
  available,
  quote,
  onClick
}: {
  provider: {
    name: string
    logo: React.JSX.Element
    token: {
      symbol: string
      amount: number
    }
    priceUSD: number
  }
  className?: string
  available?: boolean
  quote?: BuyQuote
  onClick?: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={`${quote && 'cursor-pointer'} position-relative ${className ? className : ''} ${
        !available && 'opacity-25'
      }`}
      ref={ref}
      onClick={onClick}
    >
      <div className="bridge-box box-light p-4 d-flex align-items-center justify-content-between">
        <div className="d-flex gap-4 align-items-center">
          {provider.logo}
          <div className="info">
            <div style={{ fontFamily: 'Bold' }}>{provider.name}</div>
            <div
              className="status py-1 px-1 d-flex gap-1 align-items-center"
              style={{
                borderRadius: '13px',
                borderColor: '#ffffff90',
                backgroundColor: 'rgba(116,116,128,0.12)',
                marginLeft: available ? -8 : -4
              }}
            >
              {available ? (
                <>
                  <img
                    src={BuyCoinIcon}
                    style={{
                      width: 16,
                      height: 'auto',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    {quote ? quote.quoteCurrencyAmount : '0'}{' '}
                    {quote ? quote.quoteCurrencyCode.toUpperCase() : 'ETH'}
                  </div>
                  <img
                    src={BuyCurrencyIcon}
                    style={{
                      width: 16,
                      height: 'auto',
                      objectFit: 'cover'
                    }}
                  />
                  <div>~${quote ? quote.baseCurrencyAmount : 0}</div>
                </>
              ) : (
                <span>Coming soon</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <ArrowUpRightCircle size={24} color={quote ? '#9C9894' : '#ffffff0F'} />
        </div>
      </div>
    </div>
  )
}
