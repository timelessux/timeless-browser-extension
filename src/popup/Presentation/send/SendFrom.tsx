import React from 'react'
import { useAppSelector } from '../../redux/hook'
import Avatar from '../component/Avatar'
import { cutAddress } from '../../../../utils/textConvert'
import { AvatarTemp } from '../../assets/icons/AvatarTemp'

export const SendFrom = () => {
  const { wallet } = useAppSelector((state) => state.wallet)

  return (
    <>
      <div className="box-grey px-3 py-2 d-flex align-items-center gap-2">
        {wallet?.avatar ? (
          <Avatar size={48} src={wallet?.avatar} className="hover" radius={'50%'} />
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <AvatarTemp size={48} />
          </div>
        )}
        {wallet?.ensName && (
          <div style={{color: "#ffffff80"}}>
            {wallet?.ensName} {`(${cutAddress({ address: wallet?.account.address || '' })})`}
          </div>
        )}
        {!wallet?.ensName && <div>({cutAddress({address: wallet?.account.address || ''})})</div>}
      </div>
    </>
  )
}
