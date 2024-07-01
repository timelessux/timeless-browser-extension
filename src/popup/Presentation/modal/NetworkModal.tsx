import { Avatar } from 'antd'
import React, { useState } from 'react'
import { GoDotFill } from 'react-icons/go'
import { useSwitchChain } from 'wagmi'
import { EModals } from '../../../../ts'
import { MyChain, TokenFile } from '../../../../utils/mapChains'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { popModal } from '../../redux/slices/modal/modal.slice'
import { switchWalletNetwork } from '../../redux/slices/wallet/wallet.slice'
import { ModalBase } from './ModalBase'

export const NetworkModal = () => {
  const dispatch = useAppDispatch()
  const { chain } = useAppSelector((state) => state.wallet)
  const { listToken } = useAppSelector((state) => state.token)

  const [chainSwitch, setChainSwitch] = useState<MyChain>()

  const handleCancel = () => {
    dispatch(popModal())
  }

  const { reset, switchChain: wagmiSwitchChain } = useSwitchChain({
    mutation: {
      onSuccess() {
        if (chainSwitch) {
          dispatch(switchWalletNetwork(chainSwitch))
        }
      },
      onSettled: () => {
        reset()
        handleCancel()
      }
    }
  })

  const switchNetwork = async (network: TokenFile) => {
    dispatch(popModal())
    if (wagmiSwitchChain) {
      wagmiSwitchChain({ chainId: network.chainId })
    } else dispatch(switchWalletNetwork(network.chain))
    setChainSwitch(network.chain)
  }

  return (
    <ModalBase
      modalName={EModals.NETWORK_MODAL}
      onCloseModal={handleCancel}
      className="network-modal"
      width="360px"
    >
      <div className="position-relative">
        <div className="title mb-2 p-2">Switch Networks</div>
        <div className="d-flex flex-column">
          {listToken?.map((myChain) => (
            <button
              className={`
                chain-button d-flex align-items-center justify-content-between gap-2
                ${myChain.chainId === chain?.id && '--active'}
              `}
              key={myChain.chainId}
              onClick={() => switchNetwork(myChain)}
            >
              <div className="d-flex align-items-center gap-3">
                <div>
                  {myChain.chain.logo && (
                    <Avatar alt={myChain.name ?? 'Chain icon'} src={myChain.chain.logo} size={36} />
                  )}
                </div>
                <span className="chain-name align-middle">{myChain.name || ''}</span>
              </div>
              {myChain.chainId === chain?.id && (
                <div>
                  <span className="fw-bold">Connected</span>
                  <GoDotFill size={15} color="#30E000" className="ms-1 me-1" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </ModalBase>
  )
}
