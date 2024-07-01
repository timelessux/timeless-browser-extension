import { Button } from 'antd'
import React, { ReactNode, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSwitchChain } from 'wagmi'
import { Chain } from 'wagmi/chains'
import { TRoutes } from '../../../../ts/types'
import { customChains } from '../../../../utils/mapChains'
import { ArrowRightCircleIcon } from '../../assets/icons/arrowRightCircleIcon'
import { ViewMoreIcon } from '../../assets/icons/viewMoreIcon'
import { useAppSelector } from '../../redux/hook'
import { switchWalletNetwork } from '../../redux/slices/wallet/wallet.slice'
import { SelectCustomForNetwork, SelectCustomForRoute } from './SelectCustom'
import { SendFrom } from '../send/SendFrom'

type Props = {
  title: string
  subTitle: string
  children: ReactNode
  onConfirm: () => void
  isVisibleNewNetwork?: boolean
  loading: boolean
  price: number
  visibleTotal: boolean
  chainBridge?: Chain
  setChainBridge?: React.Dispatch<React.SetStateAction<Chain | undefined>>
  gasPrice?: number
  hash?: string
  chainFrom?: Chain
  setChainFrom?: (chain: Chain) => void
  isError?: boolean
  routes?: TRoutes[]
  routeSelect?: TRoutes
  setRouteSelect?: React.Dispatch<React.SetStateAction<TRoutes | undefined>>
  isSendFrom?: boolean
}

const BoxContent = ({
  title,
  subTitle,
  children,
  onConfirm,
  isVisibleNewNetwork = false,
  loading,
  price = 0,
  visibleTotal,
  chainBridge,
  setChainBridge,
  hash,
  chainFrom,
  setChainFrom,
  isError,
  routes,
  routeSelect,
  setRouteSelect,
  isSendFrom = false
}: Props) => {
  const chains = customChains
  const wallet = useAppSelector((state) => state.wallet.wallet)

  const [chain, setChain] = useState<Chain>()

  const { switchChain: refetch, reset } = useSwitchChain({
    mutation: {
      onSuccess: () => {
        if (chain) {
          dispatch(switchWalletNetwork(chain))
          setChainFrom?.(chain)
        }
      },
      onSettled: () => {
        reset()
      }
    }
  })
  const dispatch = useDispatch()

  const linkView = `${wallet?.chain?.blockExplorers?.default.url}"/tx/"${hash}`

  // useEffect(() => {
  //   if (status !== "idle") openMessage(status, "Switching network...");
  //   if (status === "success" || status === "error") destroyMessage();
  // }, [status]);

  const switchNetwork = (chain: Chain) => {
    if (refetch) {
      refetch?.({ chainId: chain.id })
    } else dispatch(switchWalletNetwork(chain))
    setChain(chain)
  }

  return (
    <div className="position-relative" style={{ zIndex: 1 }}>
      <div className="box-content ps-4 pe-5 py-3">
        <div className="title">{title}</div>
        <div className="sub-title mb-4">{subTitle}</div>
        <div className="content-wrapper">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="d-flex align-items-end gap-3">
              <div>
                <div className="title mb-1">Network</div>
                <SelectCustomForNetwork
                  onChange={(e) => {
                    switchNetwork && switchNetwork(e)
                  }}
                  listData={chains}
                  chainSelect={chainFrom}
                  networkId={chainFrom?.id}
                />
              </div>
              {isVisibleNewNetwork && <ArrowRightCircleIcon />}
              {isVisibleNewNetwork && (
                <SelectCustomForNetwork
                  onChange={(e) => {
                    setChainBridge && setChainBridge(e)
                  }}
                  listData={chains.filter((chain) => chain.id !== chainFrom?.id)}
                  networkId={chainBridge?.id}
                  chainSelect={chainBridge}
                />
              )}
            </div>
            {isSendFrom && (
              <div>
                <div className="title mb-1">Send from</div>
                <SendFrom />
              </div>
            )}
          </div>
          {children}
          <div className="row">
            {isVisibleNewNetwork && routes && routes.length > 0 && routeSelect && setRouteSelect ? (
              <div className="col-6">
                <SelectCustomForRoute
                  routeSelect={routeSelect}
                  routes={routes}
                  position="top"
                  onChange={setRouteSelect}
                />
              </div>
            ) : (
              <div className="col-6">
                <div className="text-transaction mb-1 ms-3">
                  Your transactions will appear here...
                </div>
                {hash && (
                  <a href={linkView} target="_blank" rel="noopener noreferrer">
                    <div className="view-more d-flex gap-3 ms-3">
                      <div>View More on Blockchain Explorer</div>
                      <ViewMoreIcon />
                    </div>
                  </a>
                )}
              </div>
            )}

            <div className={`col-6 ${!visibleTotal ? 'd-none' : ''}`}>
              <div className="total-box box-grey p-4 d-flex align-items-center justify-content-between">
                <div>
                  <div className="title">Total (Amount + Gas)</div>
                  <div className="price">${visibleTotal ? price.toFixed(2) : '0.00'}</div>
                </div>
                <div>
                  <Button
                    className={`btn btn-primary confirm-button d-flex align-items-center mx-3 ${
                      loading ? 'px-4' : 'px-5'
                    }`}
                    onClick={onConfirm}
                    disabled={!visibleTotal || loading || isError}
                    loading={loading}
                  >
                    <div className="me-1">{loading ? 'Check wallet' : 'Confirm'}</div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoxContent
