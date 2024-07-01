import { Avatar } from 'antd'
import React, { Fragment, useEffect } from 'react'
import { EModals } from '../../../../../ts'
import { HexString } from '../../../../../ts/types'
import { ArrowDownIcon } from '../../../assets/icons/arrowDown'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { pushModal } from '../../../redux/slices/modal/modal.slice'
import { getNativeTokenBalanceThunk } from '../../../redux/slices/token/tokenThunk'
import { Loader } from '../../component/Loader'
import { AvatarTemp } from '../../../assets/icons/AvatarTemp'

export const WalletAccount = ({ isVisible }: { isVisible: boolean }) => {
  const dispatch = useAppDispatch()
  const { wallet, chain, isLock } = useAppSelector((state) => state.wallet)
  const { nativeTokenBalance, fetchingNativeTokenBalance } = useAppSelector((state) => state.token)

  useEffect(() => {
    if (wallet?.account.address) {
      let promise = dispatch(
        getNativeTokenBalanceThunk({
          walletAddress: wallet.account.address as HexString,
          chainId: chain.id
        })
      )
      return () => {
        // @ts-ignore
        promise.abort()
      }
    }
  }, [chain, wallet?.account.address])

  if (isLock || !isVisible) return null

  return (
    <div className="d-flex gap-2 fade-in">
      {wallet && (
        <>
          <button
            className="account-button hover px-2 py-1 d-flex align-items-center gap-1"
            onClick={() => {
              dispatch(pushModal({ name: EModals.NETWORK_MODAL }))
            }}
          >
            <div className="me-1">
              {/** @ts-ignore */}
              <Avatar alt={chain?.name ?? 'Chain icon'} src={chain?.logo} size={24} />
            </div>
            {chain?.name}
            <ArrowDownIcon />
          </button>
          <button
            type="button"
            className="account-button hover px-2 py-1 d-flex align-items-center gap-2"
            onClick={() => {
              dispatch(pushModal({ name: EModals.ACCOUNT_MODAL }))
            }}
          >
            {fetchingNativeTokenBalance && <Loader />}
            {!fetchingNativeTokenBalance && (
              <Fragment>
                {Number(nativeTokenBalance ?? '0').toFixed(5)} {chain?.nativeCurrency.symbol}
              </Fragment>
            )}

            <div className="account-info d-flex align-items-center p-1 gap-1">
              {wallet.avatar ? <Avatar src={wallet.avatar} size={24} /> : <AvatarTemp />}
              {wallet.ensName}
              <ArrowDownIcon />
            </div>
          </button>
        </>
      )}
    </div>
  )
}
