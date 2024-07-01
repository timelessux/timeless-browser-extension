import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { coinbaseWallet } from '@rainbow-me/rainbowkit/wallets'
import { QueryClient } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, zora } from 'wagmi/chains'
import { customChains } from '../../../utils/mapChains'

// Enable Coinbase Smart Wallet for testing
coinbaseWallet.preference = 'smartWalletOnly'

export const _queryClient = new QueryClient()
export const _globalChains = customChains

export const _connectors = connectorsForWallets(
  [{ groupName: 'Recommend', wallets: [coinbaseWallet] }],
  { appName: 'Timeless X', projectId: '09098d3c62976b8096165360438f9fd2' }
)

export const _wagmiConfig = createConfig({
  //@ts-ignore
  chains: _globalChains,
  connectors: _connectors,
  transports: {
    // Must match with "_globalChains"
    [base.id]: http('https://mainnet.base.org/'),
    [arbitrum.id]: http('https://rpc.ankr.com/arbitrum'),
    [optimism.id]: http('https://rpc.ankr.com/optimism'),
    [zora.id]: http('https://rpc.zora.energy'),
    [polygon.id]: http('https://rpc.ankr.com/polygon'),
    [bsc.id]: http('https://rpc.ankr.com/bsc'),
    [avalanche.id]: http('https://rpc.ankr.com/avalanche'),
    [mainnet.id]: http('https://rpc.ankr.com/eth')
    // [gnosis.id]: http('https://rpc.ankr.com/gnosis'),
    // [fantom.id]: http('https://rpc.ankr.com/fantom'),
  }
})
