import React from 'react'
import { BiCopy } from 'react-icons/bi'
import { TbLogout } from 'react-icons/tb'
import { EModals } from '../../../../ts'
import { cutAddress, getShortAddress } from '../../../../utils/textConvert'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { popModal } from '../../redux/slices/modal/modal.slice'
import Avatar from '../component/Avatar'
import { ModalBase } from './ModalBase'
import { usePageLoading } from '../../context/LoadingContext'
import { AvatarTemp } from '../../assets/icons/AvatarTemp'

export const AccountModal = ({ onDisconnect }: { onDisconnect }) => {
  const dispatch = useAppDispatch()

  const { wallet, chain } = useAppSelector((state) => state.wallet)
  const { nativeTokenBalance } = useAppSelector((state) => state.token)

  const { openMessage } = usePageLoading()

  const handleCancel = () => {
    dispatch(popModal())
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet!.account.address!)
    openMessage('success', 'Copied to clipboard')
  }

  if (wallet === undefined) {
    return <></>
  }

  return (
    <ModalBase
      modalName={EModals.ACCOUNT_MODAL}
      onCloseModal={handleCancel}
      className="network-modal"
      width="360px"
    >
      <div className="position-relative">
        <div className="d-flex flex-column mt-4">
          {wallet.avatar && wallet.avatar !== '' ? (
            <Avatar size={40} radius={'50%'} src={wallet.avatar} />
          ) : (
            <div className="d-flex align-items-center justify-content-center">
              <AvatarTemp size={74} />
            </div>
          )}
          <div
            style={{
              fontSize: 18,
              color: '#fff',
              fontFamily: 'Bold',
              textAlign: 'center',
              marginTop: 15
            }}
          >
            {cutAddress({ address: wallet.account.address ?? '' })}
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#ffffff99',
              fontFamily: 'Bold',
              textAlign: 'center'
            }}
          >
            {Number(nativeTokenBalance ?? '0').toFixed(5)}
            {' ' + chain?.nativeCurrency.symbol}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 15
            }}
          >
            <button
              style={{
                display: 'flex',
                flexGrow: 1,
                border: 'none',
                backgroundColor: '#e0e8ff1a',
                borderRadius: 10,
                padding: 5
              }}
              onClick={copyToClipboard}
            >
              <div style={{ margin: 'auto' }}>
                <BiCopy size={20} color="#fff" />
                <div
                  style={{
                    color: '#fff',
                    fontFamily: 'Bold'
                  }}
                >
                  Copy Address
                </div>
              </div>
            </button>
            <button
              style={{
                display: 'flex',
                flexGrow: 1,
                border: 'none',
                backgroundColor: '#e0e8ff1a',
                borderRadius: 10,
                padding: 5
              }}
              onClick={onDisconnect}
            >
              <div
                style={{
                  margin: 'auto'
                }}
              >
                <TbLogout size={20} color="#fff" />
                <div
                  style={{
                    color: '#fff',
                    fontFamily: 'Bold'
                  }}
                >
                  Disconnect
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  )
}
