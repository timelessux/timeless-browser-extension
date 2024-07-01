import React, { useCallback, useEffect, useState } from 'react'
// import { useWalletClient } from 'wagmi'
// import { useClient } from "@xmtp/react-sdk";
import { getData, setTelegramLoggedIn } from '../../../../utils/chromeStorage'
import { CSSProperties } from 'styled-components'

//@ts-ignore
const { VITE_TELEGRAM_URL } = import.meta.env

function ChatView({ provider }: { provider: string }) {
  // const { isLoading, initialize, client } = useClient();
  // const { data: walletClient } = useWalletClient()

  const [telegramState, setTelegramState] = useState<string>()
  const [zIndex, setZIndex] = useState<number>(3)

  // const handleConnect = useCallback(async () => {
  //   await initialize({
  //     signer: walletClient,
  //     options: {
  //       env: "production"
  //     }
  //   });

  // }, [initialize, walletClient]);

  async function checkTelegram() {
    const isLoggedIn = await getData('tTelegram')
    setTelegramState(isLoggedIn ? 'authorizationStateReady' : undefined)
  }

  useEffect(() => {
    checkTelegram()
  }, [])

  useEffect(() => {
    const isAuth = telegramState === 'authorizationStateReady'
    if (telegramState) {
      setTelegramLoggedIn(isAuth)
    }
  }, [telegramState])

  const renderTelegram = useCallback(() => {
    const isAuth = telegramState === 'authorizationStateReady' || telegramState === 'changeZindex'

    const style: CSSProperties = { borderRadius: 44, position: 'relative', zIndex: 1 }

    return (
      <div style={{ width: !isAuth ? '33%' : '100%', height: '100%' }}>
        <iframe
          className="telegram w-100 h-100"
          style={style}
          src={VITE_TELEGRAM_URL}
          loading="lazy"
        />
      </div>
    )
  }, [telegramState])

  window.addEventListener(
    'message',
    function (e) {
      setTelegramState(e.data)
    },
    false
  )

  return (
    <>
      {provider === 'telegram' && (
        <div className="w-100 h-100 d-flex">
          {!telegramState ? (
            <div className="left-content">
              <div className="d-flex flex-column align-items-center justify-content-evenly h-100">
                <div className="d-flex flex-column align-items-center text-center gap-2">
                  <span
                    style={{
                      fontFamily: 'Bold',
                      fontSize: 18
                    }}
                  >
                    900M+ Telegram users
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      opacity: '0.6'
                    }}
                  >
                    Your favorite messaging app, now with <br /> Timeless convenience.
                  </span>
                </div>
                <div className="d-flex flex-column align-items-center text-center gap-2">
                  <button
                    className="py-2 px-4"
                    onClick={() => {
                      setTelegramState('authorizationStateWaitQrCode')
                    }}
                    style={{
                      width: 'fit-content',
                      backgroundColor: '#00000066',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 40,
                      fontFamily: 'Medium',
                      fontSize: 17
                    }}
                  >
                    Connect Telegram
                  </button>
                  <span
                    style={{
                      fontSize: 13,
                      opacity: '0.6'
                    }}
                  >
                    Service is from Telegram. By using the <br /> service, you agree to the Telegram
                    terms <br /> and privacy policy.
                  </span>
                </div>
                <div
                  style={{ visibility: 'hidden' }}
                  className="d-flex flex-column align-items-center text-center gap-2"
                >
                  <span
                    style={{
                      fontFamily: 'Bold',
                      fontSize: 18
                    }}
                  >
                    800m+ Telegram users
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      opacity: '0.6'
                    }}
                  >
                    Your favorite messaging app, now with <br /> Timeless convenience.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            renderTelegram()
          )}
        </div>
      )}
      {/* {provider === "xmtp" &&
        <>
          {!client ?
            <XMTPConnect handleConnect={handleConnect} isLoading={isLoading} /> :
            <div className="d-flex w-100 h-100">
              <div style={{
                width: "33%",
                backgroundColor: "#00000014"
              }}>
                <NewMessage />
                <Inbox />
              </div>
              <Messages />
            </div>
          }
        </>
      } */}
    </>
  )
}

export default ChatView
