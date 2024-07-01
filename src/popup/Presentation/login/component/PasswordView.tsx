import React, { Fragment, SetStateAction, useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsKey } from 'react-icons/bs'
import { initEncryptStorage, lockWallet } from '../../../../../utils/chromeStorage'
import { useDebounce } from './../../hook/useDebounce'

interface Props {
  onClick: () => void
  setFinalPassword: React.Dispatch<SetStateAction<string>>
}

function PasswordView({ onClick, setFinalPassword }: Props) {
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
  const [visiblePasswordConfirm, setVisiblePasswordConfirm] = useState<boolean>(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('')
  const [canSetPassword, setCanSetPassword] = useState(false)

  const _debouncePassword = useDebounce(password, 200)
  const _debounceConfirmPassword = useDebounce(confirmPassword, 200)

  const _debounceErrorPassword = useDebounce(errorPassword, 200)
  const _debounceErrorConfirmPassword = useDebounce(errorConfirmPassword, 200)

  const validatePassword = (value: string) => {
    errorPassword && setErrorPassword('')
    errorConfirmPassword && setErrorConfirmPassword('')

    if (value && value.length < 10) return setErrorPassword('Minimum 10 characters for password')
  }

  const validateConfirmPassword = (value: string) => {
    errorPassword && setErrorPassword('')
    errorConfirmPassword && setErrorConfirmPassword('')
    if (value && value.length < 10) {
      return setErrorConfirmPassword('Minimum 10 characters for confirm password')
    }
  }

  const handleSetPassword = () => {
    if (canSetPassword) {
      setFinalPassword(password)
      initEncryptStorage(password)
      lockWallet()
      onClick()
    }
  }

  useEffect(() => {
    if (!_debounceErrorPassword && !_debounceErrorConfirmPassword) {
      if (password && confirmPassword) {
        if (password === confirmPassword) {
          setErrorPassword('')
          setErrorConfirmPassword('')
          return setCanSetPassword(true)
        }
        return setErrorPassword('Passwords do not match')
      }
    }
    setCanSetPassword(false)
  }, [
    _debounceErrorPassword,
    _debounceErrorConfirmPassword,
    _debouncePassword,
    _debounceConfirmPassword
  ])

  return (
    <div className="d-flex flex-column w-50">
      {(errorPassword || errorConfirmPassword) && (
        <div className="position-absolute invalid-mnemonic px-4 d-flex align-items-center fade-in">
          <div className="d-flex align-items-center gap-2">
            <BsKey color="#FFD60A" className="key-icon" size={24} />
            <span style={{ fontFamily: 'Bold' }}>{errorPassword || errorConfirmPassword}</span>
            <span style={{ opacity: 0.6 }}>Double check and retry</span>
          </div>
        </div>
      )}
      <p>
        <span style={{ fontFamily: 'Bold', fontSize: 30 }}>SET UNLOCK PASSWORD</span>
        <br />
        <span style={{ opacity: 0.6 }}>
          To protect your privacy. Timeless does not store your password. <br /> Please remember to
          keep your password safe.
        </span>
      </p>
      <div className="d-flex flex-column gap-3">
        <div className="d-flex flex-column gap-2">
          <span style={{ opacity: 0.6 }}>Password</span>
          <div
            className="d-flex align-items-center password-wallet px-2"
            style={{
              padding: '5px',
              width: '100%',
              backgroundColor: '#1A1A1E',
              border: 'none',
              borderRadius: '15px',
              color: '#fff'
            }}
          >
            <input
              required
              minLength={10}
              value={password}
              type={visiblePassword ? 'text' : 'password'}
              className="input-text ms-1 me-1 py-3"
              placeholder="Enter password"
              style={{
                backgroundColor: '#1A1A1E',
                border: 'none',
                borderRadius: '15px',
                color: '#fff',
                outline: 'none',
                flex: 1
              }}
              onChange={(event) => {
                event.preventDefault()
                setPassword(event.target.value)
                validatePassword(event.target.value)
              }}
            />
            <div
              className={'mb-1 cursor-pointer'}
              onClick={() => setVisiblePassword(!visiblePassword)}
            >
              {password && (
                <Fragment>
                  {visiblePassword && <AiOutlineEye size={16} />}
                  {!visiblePassword && <AiOutlineEyeInvisible size={16} />}
                </Fragment>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex flex-column gap-2">
          <span style={{ opacity: 0.6 }}>Confirm password</span>
          <div
            className="d-flex align-items-center password-wallet px-2"
            style={{
              padding: '5px',
              width: '100%',
              backgroundColor: '#1A1A1E',
              border: 'none',
              borderRadius: '15px',
              color: '#fff'
            }}
          >
            <input
              required
              minLength={10}
              value={confirmPassword}
              type={visiblePasswordConfirm ? 'text' : 'password'}
              className="input-text ms-1 me-1 py-3"
              placeholder="Re-enter password"
              style={{
                backgroundColor: '#1A1A1E',
                border: 'none',
                borderRadius: '15px',
                color: '#fff',
                outline: 'none',
                flex: 1
              }}
              onChange={(event) => {
                event.preventDefault()
                setConfirmPassword(event.target.value)
                validateConfirmPassword(event.target.value)
              }}
              onKeyDown={(e) => {
                if (e.code === 'Enter') {
                  handleSetPassword()
                }
              }}
            />
            <div
              className={'mb-1 cursor-pointer'}
              onClick={() => setVisiblePasswordConfirm(!visiblePasswordConfirm)}
            >
              {confirmPassword && (
                <Fragment>
                  {visiblePasswordConfirm && <AiOutlineEye size={16} />}
                  {!visiblePasswordConfirm && <AiOutlineEyeInvisible size={16} />}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="p-3 my-5"
        style={{
          backgroundColor: '#27282c',
          textAlign: 'center',
          cursor: canSetPassword ? 'pointer' : '',
          opacity: canSetPassword ? 1 : 0.5,
          borderRadius: '50px'
        }}
        onClick={handleSetPassword}
      >
        Confirm
      </div>
    </div>
  )
}

export default PasswordView
