import React from 'react'
import Typed from 'react-typed'
import { getData, setIsFirstTimeOpen } from '../../../../../utils/chromeStorage'

//@ts-ignore
import Caution from '../../../assets/images/caution.png'
//@ts-ignore
import XLogo512 from '../../../assets/images/timelessx.svg'

export default function CautionView({ onClick }: { onClick: () => void }) {
  const _onClickAgree = async () => {
    const _isFirstTimeOpen = await getData('isFirstTimeOpen')

    /**
     * First time user install extension => '_isFirstTimeOpen' is undefined
     * First time user install extension => setIsFirstTimeOpen equal 'true'
     */
    if (_isFirstTimeOpen === undefined) await setIsFirstTimeOpen(true)
    /** */

    onClick()
  }

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
        <div
          style={{
            width: 486,
            minHeight: 754,
            backgroundColor: '#1A1B1F',
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 40,
            paddingRight: 40,
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'center',
            gap: 30,
            marginBottom: 24,
            marginTop: 24
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10
            }}
          >
            <img src={XLogo512} width={52} height={52} style={{ borderRadius: 10 }} />
            <div
              className="text-center"
              style={{
                fontFamily: 'Heavy',
                fontSize: 18
              }}
            >
              Timeless X
            </div>
          </div>
          <img src={Caution} width={286} height={168} />
          <div
            style={{
              color: 'white',
              opacity: 0.6,
              fontSize: 14,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'Medium'
            }}
          >
            {
              'Timeless is your all-in-one social utility platform, where wallets, profiles, and social feeds come together effortlessly. Pay, connect, chat, and collaborate faster and easier than ever before.\n\nNow, with Coinbase Smart Wallet collab, getting on-chain  has never been easier.\n\nNOTE: The extension might change or stay in alpha forever. So, use it at your own risk and enjoy the ride!'
            }
          </div>
          <div className="btn-accept btn-common rainbow-border-button" onClick={_onClickAgree}>
            I agree and accept
          </div>
        </div>
      </div>
      <div className="col-4 login-right-side d-flex align-items-center justify-content-center">
        <div className="d-block">
          <div className="d-flex align-items-end justify-content-center mb-3">
            <img src={XLogo512} width={150} style={{ borderRadius: 20 }} />
          </div>
          <div className="d-flex align-items-end justify-content-center">
            <div className="d-flex align-items-end justify-content-center">
              <Typed
                className="typed-ctn"
                style={{ marginLeft: 20 }}
                strings={[
                  `Let's chit-chat`,
                  `Let's create`,
                  `Let's crypto`,
                  `Let's defi`,
                  `Let's design`,
                  `Let's discover`,
                  `Let's explore`,
                  `Let's focus`,
                  `Let's Timeless`
                ]}
                typeSpeed={50}
                backSpeed={30}
                loop={false}
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
