import React, { SetStateAction, useCallback, useEffect } from 'react'
import Typed from 'react-typed'
import { ELoginState } from '../../../../ts'
import { useAppSelector } from '../../redux/hook'
import PasswordView from './component/PasswordView'
import { RestoreWallet } from './component/RestoreWalletView'
import { ConnectWalletSection } from './component/WalletConnectView'

//@ts-ignore
import XLogo512 from '../../assets/images/timelessx.svg'

interface Props {
  loginState: ELoginState
  setLoginState: React.Dispatch<React.SetStateAction<ELoginState>>
  setPassword: React.Dispatch<SetStateAction<string>>
  password: string
}

export function LoginView({ loginState, setLoginState, setPassword, password }: Props) {
  const { wallet } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    if (wallet) setLoginState(ELoginState.DASHBOARD)
  }, [wallet])

  const renderLoginView = useCallback(() => {
    switch (loginState) {
      case ELoginState.RESTORE_WALLET:
        return (
          <RestoreWallet
            password={password}
            goBack={() => setLoginState(ELoginState.WALLET_CONNECT)}
          />
        )
      case ELoginState.WALLET_CONNECT:
        return <ConnectWalletSection onClick={() => setLoginState(ELoginState.RESTORE_WALLET)} />
      case ELoginState.PASSWORD:
        return (
          <PasswordView
            setFinalPassword={setPassword}
            onClick={() => setLoginState(ELoginState.WALLET_CONNECT)}
          />
        )
    }
  }, [loginState])

  return (
    <div className="row">
      <div
        className="position-relative col-8 login-left-side d-flex align-items-center justify-content-center hidden-scroll-bar"
        style={{
          height: '100vh',
          overflow: 'scroll',
          paddingLeft: 28,
          paddingRight: 15
        }}
      >
        {renderLoginView()}
      </div>
      <div className="col-4 login-right-side d-flex align-items-center justify-content-center">
        <div className="d-block">
          <div className="d-flex align-items-end justify-content-center mb-3">
            <img src={XLogo512} width={150} style={{ borderRadius: 20 }} />
          </div>
          <div className="d-flex align-items-end justify-content-center">
            <div className="d-flex align-items-end justify-content-center" onClick={() => {}}>
              <Typed
                className="typed-ctn"
                strings={[
                  "Let's chit-chat",
                  "Let's create",
                  "Let's crypto",
                  "Let's defi",
                  "Let's design",
                  "Let's discover",
                  "Let's explore",
                  "Let's focus",
                  "Let's Timeless"
                ]}
                typeSpeed={50}
                backSpeed={30}
                loop
                smartBackspace={false}
                showCursor={false}
              />
            </div>
            <div className="violet-dot ms-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
