import { Chain, Wallet, getWalletConnectConnector } from '@rainbow-me/rainbowkit'
import { metamaskProvider } from '../../services/stream'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import type { Connector } from 'wagmi/connectors'
import { isAndroid, isIOS } from '../../utils/isMobile'

const _TIMELESS_DEEPLINK = 'https://timelesswallet.xyz/'

export interface MyWalletOptions {
  projectId: string
  chains: Chain[]
}
export const timeless = ({ chains, projectId }: MyWalletOptions): Wallet => ({
  id: 'timeless-wallet',
  name: 'Timeless iOS',
  iconUrl: 'https://res.cloudinary.com/timeless/image/upload/app/Wallet/timeless.png',
  iconBackground: '#0c2f78',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=my.wallet',
    ios: 'https://apps.apple.com/us/app/timeless-wallet/id1592807339',
    qrCode: 'https://apps.apple.com/us/app/timeless-wallet/id1592807339'
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ projectId, chains })
    return {
      connector,
      mobile: {
        getUri: async () => {
          const provider = await connector.getProvider()
          const uri = await new Promise<string>((resolve) => provider.once('display_uri', resolve))
          return `${_TIMELESS_DEEPLINK}wc?uri=${uri}`
        }
      },
      qrCode: {
        getUri: async () => {
          const provider = await connector.getProvider()
          const uri = await new Promise<string>((resolve) => provider.once('display_uri', resolve))
          return uri
        },
        instructions: {
          learnMoreUrl: 'https://my-wallet/learn-more',
          steps: [
            {
              description:
                'We recommend putting My Wallet on your home screen for faster access to your wallet.',
              step: 'install',
              title: 'Open the My Wallet app'
            },
            {
              description:
                'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
              step: 'create',
              title: 'Create or Import a Wallet'
            },
            {
              description:
                'After you scan, a connection prompt will appear for you to connect your wallet.',
              step: 'scan',
              title: 'Tap the scan button'
            }
          ]
        }
      },
      extension: {
        instructions: {
          learnMoreUrl: 'https://my-wallet/learn-more',
          steps: [
            {
              description:
                'We recommend pinning My Wallet to your taskbar for quicker access to your wallet.',
              step: 'install',
              title: 'Install the My Wallet extension'
            },
            {
              description:
                'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
              step: 'create',
              title: 'Create or Import a Wallet'
            },
            {
              description:
                'Once you set up your wallet, click below to refresh the browser and load up the extension.',
              step: 'refresh',
              title: 'Refresh your browser'
            }
          ]
        }
      }
    }
  }
})

export const metaMaskWallet = ({ chains, projectId, shouldUseWalletConnect }): Wallet => {
  async function getWalletConnectUri(connector: Connector, version: '1' | '2'): Promise<string> {
    const provider = await connector.getProvider()
    return version === '2'
      ? new Promise<string>((resolve) => provider.once('display_uri', resolve))
      : provider.connector.uri
  }
  return {
    id: 'metaMask',
    name: 'MetaMask',
    iconUrl: async () => (await import('./assets/icons/metamaskIcon.svg')).default,
    iconAccent: '#f6851a',
    iconBackground: '#fff',
    installed: !shouldUseWalletConnect,
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
      mobile: 'https://metamask.io/download',
      qrCode: 'https://metamask.io/download',
      chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
      firefox: 'https://addons.mozilla.org/firefox/addon/ether-metamask',
      opera: 'https://addons.opera.com/extensions/details/metamask-10',
      browserExtension: 'https://metamask.io/download'
    },
    createConnector: () => {
      const connector = new MetaMaskConnector({
        chains,
        options: {
          projectId: projectId,
          UNSTABLE_shimOnConnectSelectAccount: true,
          getProvider: () => metamaskProvider
        }
      })

      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, '2')
        return isAndroid()
          ? uri
          : isIOS()
            ? // currently broken in MetaMask v6.5.0 https://github.com/MetaMask/metamask-mobile/issues/6457
              `metamask://wc?uri=${encodeURIComponent(uri)}`
            : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`
      }

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl: 'https://metamask.io/faqs/',
                steps: [
                  {
                    description: 'wallet_connectors.metamask.qr_code.step1.description',
                    step: 'install',
                    title: 'wallet_connectors.metamask.qr_code.step1.title'
                  },
                  {
                    description: 'wallet_connectors.metamask.qr_code.step2.description',
                    step: 'create',
                    title: 'wallet_connectors.metamask.qr_code.step2.title'
                  },
                  {
                    description: 'wallet_connectors.metamask.qr_code.step3.description',
                    step: 'refresh',
                    title: 'wallet_connectors.metamask.qr_code.step3.title'
                  }
                ]
              }
            }
          : undefined,
        extension: {
          instructions: {
            learnMoreUrl: 'https://metamask.io/faqs/',
            steps: [
              {
                description: 'wallet_connectors.metamask.extension.step1.description',
                step: 'install',
                title: 'wallet_connectors.metamask.extension.step1.title'
              },
              {
                description: 'wallet_connectors.metamask.extension.step2.description',
                step: 'create',
                title: 'wallet_connectors.metamask.extension.step2.title'
              },
              {
                description: 'wallet_connectors.metamask.extension.step3.description',
                step: 'refresh',
                title: 'wallet_connectors.metamask.extension.step3.title'
              }
            ]
          }
        }
      }
    }
  }
}
