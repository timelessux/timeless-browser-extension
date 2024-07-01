import { getEnsAvatar, getEnsName, signMessage } from '@wagmi/core'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { GetEnsAvatarReturnType } from 'viem/ens'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { login, storeAccount } from '../../../../../utils/chromeStorage'
import { hasToken, setToken } from '../../../../../utils/token'
import { WCWallet } from '../../../../../utils/wallet'
import { _wagmiConfig } from '../../../configs/wagmiConfig'
import { usePageLoading } from '../../../context/LoadingContext'
import { setWallet, switchWalletNetwork } from '../../../redux/slices/wallet/wallet.slice'
import useLoginModelController from '../hook/useLoginModelController'
import { CoinbaseIcon1 } from '../../../assets/icons/coinbase/CoinbaseIcon1'
import { CoinbaseIcon2 } from '../../../assets/icons/coinbase/CoinbaseIcon2'

export function ConnectWalletSection({ onClick }: { onClick: () => void }) {
  const dispatch = useDispatch()
  const { destroyMessage, openMessage } = usePageLoading()
  const {
    getAuthChalenge,
    authenticateWithLens,
    createSiweMessage,
    saveLensProfile,
    getProfiles,
    createChangeProfileManagersTypedData
  } = useLoginModelController()

  const { disconnect } = useDisconnect()
  const { chain } = useAccount({ config: _wagmiConfig })
  const { connectors, connect } = useConnect({
    mutation: { onSuccess: (value) => _initWallet(value.accounts[0]) }
    // mutation: { onSuccess: (value) => _initWallet('0x0784D6612b11943Dc5F6A609b69e6a49a4661Bed') }
  })

  const _onCreateWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find((c) => c.id === 'coinbaseWalletSDK')
    if (coinbaseWalletConnector) connect({ connector: coinbaseWalletConnector })
  }, [connectors, connect])

  const mapWalletData = async (address: `0x${string}`) => {
    const ensName = await getEnsName(_wagmiConfig, { address, chainId: 1 })
    let avatarUrl: GetEnsAvatarReturnType = ''
    if (ensName) {
      avatarUrl = await getEnsAvatar(_wagmiConfig, {
        name: ensName,
        chainId: 1
      })
    }

    return {
      account: { address },
      ensAvatar: avatarUrl,
      ensName: ensName,
      avatar: avatarUrl,
      chain
    }
  }

  const fetchData = async (address) => {
    const token = await hasToken()
    const profiles = await getProfiles(address)

    if (!token && profiles && profiles.length > 0) {
      const auth = await getAuthChalenge(address, profiles[0].id)
      if (auth) {
        try {
          openMessage('loading', 'Awaiting signature...')
          const signature = await signMessage(_wagmiConfig, { message: auth.text })
          const response = await authenticateWithLens(signature, address, auth.authId)
          if (response) {
            const { accessToken, refreshToken } = response
            setToken(accessToken, refreshToken)
            await saveLensProfile(address)
            await createChangeProfileManagersTypedData()
          }
        } catch (error) {
          throw new Error(error)
        }
      }
    }
    destroyMessage()
  }

  async function _initWallet(address) {
    try {
      const res = await mapWalletData(address)
      const siwe = createSiweMessage(address)
      let sig = ''
      sig = await signMessage(_wagmiConfig, { message: siwe })
      const walletData = {
        ...res,
        siweMessage: siwe.replace(/\n/g, '\\n'),
        signature: sig
      }
      await storeAccount(walletData)
      await login()
      await fetchData(address)
      const wallet = new WCWallet(
        walletData.account,
        walletData.siweMessage,
        walletData.signature,
        walletData.avatar ?? undefined,
        walletData.ensName ?? undefined,
        walletData.chain
      )
      dispatch(setWallet({ wallet: wallet }))
      walletData.chain && dispatch(switchWalletNetwork(walletData.chain))
    } catch (error) {
      destroyMessage()
      disconnect()
      openMessage('error', error.details)
    }
  }

  return (
    <div className="ctn-wallet-connect">
      <div className="coinbase-logo-wrapper">
        <CoinbaseIcon1 />
        <p className="slogan">
          The fastest and easiest way to <br />
          get started onchain
        </p>
        <CoinbaseIcon2 />
      </div>
      <div className="d-flex flex-column">
        <button onClick={_onCreateWallet} className="rainbow-border-button create-wallet-button">
          Create smart wallet
        </button>
        {/* <button onClick={onClick} className="import-wallet-button">
          Import wallet
        </button> */}
      </div>
    </div>
  )
}
