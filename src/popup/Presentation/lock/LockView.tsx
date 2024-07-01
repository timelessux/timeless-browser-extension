import React, { useEffect, useRef, useState } from 'react'
import { BsKey } from 'react-icons/bs'
import { FaArrowRight } from 'react-icons/fa'
import { TValidate } from '../../../../ts/types'
import { useAppDispatch } from '../../redux/hook'
import { setComponent } from '../../redux/slices/tutorial/tutorial.slice'

interface Props {
  onUnlock?: () => void
  validate: TValidate
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
}

const LockView = ({ onUnlock, validate, password, setPassword }: Props) => {
  const [disabledConfirm, setDisabledConfirm] = useState<boolean>(true)
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (ref && ref.current) {
      const data = ref.current.getBoundingClientRect()
      dispatch(
        setComponent({
          ref: data,
          customHeight: 150,
          customTop: -80,
          customWidth: 150,
          customLeft: -75,
          customRight: 60,
          topText: 0
        })
      )
    }
  }, [])

  return (
    <div className='d-flex align-items-center'>
      <div className='lock-page fade-in' ref={ref}>
        <div className='d-flex align-items-center justify-content-center gap-2'>
          <div className='group-input-password p-2' id='gr'>
            <BsKey color='rgba(255, 255, 255, 0.96)' className='key-icon' />

            <input
              value={password}
              type='password'
              className='input-password align-middle ms-1'
              placeholder='Enter Password'
              onChange={(event) => {
                event.preventDefault()
                setPassword(event.target.value)
                setDisabledConfirm(!event.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !disabledConfirm) {
                  onUnlock?.()
                }
              }}
            />
            <div className='text-danger text-center mt-2'>
              {validate.message}
            </div>
          </div>

          <button
            className={`confirm-button p-2 d-flex align-items-center justify-content-center ${
              disabledConfirm ? '' : 'hover'
            }`}
            disabled={disabledConfirm}
            onClick={onUnlock}
          >
            <FaArrowRight />
          </button>
        </div>
        <div className='title-lock text-center'>Your Wallet</div>
        <div className='sub-title-lock text-center'>
          Unlock your wallet to continue
        </div>
      </div>
    </div>
  )
}

export default LockView
