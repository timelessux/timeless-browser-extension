import { Account, createPublicClient, createWalletClient, http } from 'viem'
import { HexString } from '../ts/types'
import { buildERC20Transaction, gasEstimator } from './w3'

import {
  getPublicClient,
  sendTransaction,
  waitForTransactionReceipt,
  writeContract
} from '@wagmi/core'
import { sendCalls, getCallsStatus } from '@wagmi/core/experimental'
import { Chain } from 'wagmi/chains'
import { customChains, getChain } from './mapChains'
import { _wagmiConfig } from '../src/popup/configs/wagmiConfig'

export type TransactionData = {
  to: HexString
  data: HexString
  value: bigint
  chainId: number
  gas?: bigint
  gasPrice?: bigint
  gasLimit?: bigint
  tokenAddress?: HexString
}

export type TransactionResult = {
  status: 'FAILED' | 'SUCCESS'
  hash?: HexString
}

export interface WalletConnectAccount {
  address: string
}

export interface Wallet {
  account: Account | WalletConnectAccount
  ensName: string | undefined
  avatar: string | undefined
  chain: Chain | undefined
  balance: string | undefined
  executeTransaction(transaction: TransactionData): Promise<TransactionResult>
  executeERC20Transaction(params: Omit<TransactionData, 'data'>): Promise<TransactionResult>
  batchTransactions(transactions: TransactionData[]): Promise<TransactionResult>
  // getBalance(chainId: number):Promise<string> ;
}

export class EOAWallet implements Wallet {
  ensName: string | undefined
  avatar: string | undefined
  account: Account
  balance: string | undefined
  chain: Chain
  constructor(account: Account, ensName?: string, avatar?: string) {
    this.account = account
    this.balance = undefined
    this.chain = customChains[0]
    this.ensName = ensName
    this.avatar = avatar
  }

  async executeTransaction(transaction: TransactionData): Promise<TransactionResult> {
    const selectedChain = await getChain(transaction.chainId)
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(selectedChain?.rpc)
    })
    const walletClient = createWalletClient({
      account: this.account,
      chain: selectedChain,
      transport: http(selectedChain?.rpc)
    })

    const gasPrice = transaction.gasPrice ?? (await publicClient.getGasPrice())
    const gas =
      (transaction.gas || transaction.gasLimit) ??
      //@ts-ignore
      (await gasEstimator(this.account, transaction.to, transaction.value, publicClient))
    const request = await walletClient.prepareTransactionRequest({
      account: this.account,
      chain: selectedChain,
      to: transaction.to,
      value: transaction.value,
      gas,
      // gas: BigInt(findToken?.token_symbol === chainFrom?.nativeCurrency.symbol ? 21000 : 100000),
      gasPrice: gasPrice
    })
    if (request.data === undefined) {
      request.data = '0x'
    }
    const hash = await walletClient.sendTransaction(request)
    if (hash) {
      const transaction = await publicClient.waitForTransactionReceipt({ hash: hash })
      if (transaction.status === 'success') {
        return {
          status: 'SUCCESS',
          hash: hash
        }
      }
      if (transaction.status === 'reverted') {
        return {
          status: 'FAILED',
          hash: hash
        }
      }
    }
    return {
      status: 'FAILED'
    }
  }

  async executeERC20Transaction(props: Omit<TransactionData, 'data'>): Promise<TransactionResult> {
    const { tokenAddress, to, chainId, value } = props
    const _selectedChain = await getChain(chainId)

    if (!_selectedChain || !tokenAddress) return { status: 'FAILED' }

    const publicClient = createPublicClient({
      chain: _selectedChain,
      transport: http(_selectedChain?.rpc)
    })

    const walletClient = createWalletClient({
      account: this.account,
      chain: _selectedChain,
      transport: http(_selectedChain!.rpc)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, ...request } = await buildERC20Transaction({
      from: this.account.address as HexString,
      to,
      amount: value.toString(),
      chain: _selectedChain,
      tokenAddress
    })

    const hash = await walletClient.writeContract(request)
    if (hash) {
      const transaction = await publicClient.waitForTransactionReceipt({ hash: hash })
      if (transaction.status === 'success') {
        return {
          status: 'SUCCESS',
          hash: hash
        }
      }
      if (transaction.status === 'reverted') {
        return {
          status: 'FAILED',
          hash: hash
        }
      }
    }
    return {
      status: 'FAILED'
    }
  }
}

export class WCWallet implements Wallet {
  ensName: string | undefined
  avatar: string | undefined
  account: WalletConnectAccount
  balance: string | undefined
  chain: Chain | undefined
  siweMessage?: string
  signature?: string

  constructor(
    account: WalletConnectAccount,
    siweMessage?: string,
    signature?: string,
    avatar?: string,
    ensName?: string,
    chain?: Chain
  ) {
    this.account = account
    this.balance = undefined
    this.siweMessage = siweMessage
    this.signature = signature
    this.ensName = ensName
    this.avatar = avatar
    this.chain = chain
  }

  async batchTransactions(transactions: TransactionData[]): Promise<TransactionResult> {
    const callId = await sendCalls(_wagmiConfig, {
      chainId: transactions[0].chainId,
      calls: transactions
    })

    if (callId) {
      const data = await getCallsStatus(_wagmiConfig, { id: callId })

      if (data.status === 'CONFIRMED') {
        return {
          status: 'SUCCESS',
          //@ts-ignore
          hash: data.receipts[0].transactionHash
        }
      }
      // if (data.status === 'reverted') {
      //   return {
      //     status: 'FAILED',
      //     hash: _hashResult
      //   }
      // }
    }

    return {
      status: 'FAILED'
    }
  }

  async executeTransaction(transaction: TransactionData): Promise<TransactionResult> {
    const publicClient = getPublicClient(_wagmiConfig)

    const gasPrice = transaction.gasPrice ?? (await publicClient?.getGasPrice())

    const _hashResult = await sendTransaction(_wagmiConfig, {
      //@ts-ignore
      chainId: transaction.chainId,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas || transaction.gasLimit,
      data: transaction.data,
      gasPrice
    })

    if (_hashResult) {
      const data = await waitForTransactionReceipt(_wagmiConfig, { hash: _hashResult })

      if (data.status === 'success') {
        return {
          status: 'SUCCESS',
          hash: _hashResult
        }
      }
      if (data.status === 'reverted') {
        return {
          status: 'FAILED',
          hash: _hashResult
        }
      }
    }

    return {
      status: 'FAILED'
    }
  }

  async executeERC20Transaction(props: Omit<TransactionData, 'data'>): Promise<TransactionResult> {
    const { tokenAddress, to, chainId, value } = props
    const _selectedChain = await getChain(chainId)

    if (!_selectedChain || !tokenAddress) return { status: 'FAILED' }

    const _ERC20Transaction = await buildERC20Transaction({
      from: this.account.address as HexString,
      to,
      amount: value.toString(),
      chain: _selectedChain,
      tokenAddress
    })

    const { chain, ...request } = _ERC20Transaction
    const _result = await writeContract(_wagmiConfig, request)

    if (_result) {
      const data = await waitForTransactionReceipt(_wagmiConfig, {
        hash: _result
      })

      if (data.status === 'success') {
        return {
          status: 'SUCCESS',
          hash: _result
        }
      }

      if (data.status === 'reverted') {
        return {
          status: 'FAILED',
          hash: _result
        }
      }
    }

    return {
      status: 'FAILED'
    }
  }
}
