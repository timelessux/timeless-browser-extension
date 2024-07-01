import { getBalance, multicall } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { useState } from 'react'
import BaseService from '../../../../services/axios'
import { NFT } from '../../Domain/Model/Token'
import { NftRepository, WalletConnectRepository } from '../../Domain/Repository'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { setTokenFiles } from '../../redux/slices/token-setting/token-setting.slice'
import {
  setCollectionList,
  setIsFetchCollection,
  setNFTList,
  setNFTSellected
} from '../../redux/slices/token/token.slice'
import { HexString } from '../../../../ts/types'
import { _wagmiConfig } from '../../configs/wagmiConfig'

export const useCollectionViewModel = () => {
  const axiosClient = new BaseService()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCollection, setLoadingCollection] = useState<boolean>(false)
  const [nft, setNft] = useState<NFT | null>(null)
  const dispatch = useAppDispatch()

  const { wallet, refetchTotal, chain } = useAppSelector((state) => state.wallet)

  async function getNft({
    address,
    chain,
    cursor,
    isLoadMore
  }: {
    address: string
    chain: number
    cursor: string | null
    isLoadMore: boolean
  }) {
    try {
      !isLoadMore && setLoading(true)
      const res = await NftRepository().getNft(address, chain, cursor)
      if (res.data) {
        dispatch(
          setNFTList({
            nfts: res.data['nft'].getNftsByWallets.items,
            next: res.data['nft'].getNftsByWallets.next || null,
            isLoadMore
          })
        )
      }
    } catch (error) {
      throw new Error(error)
    }
    setLoading(false)
  }

  async function getCollections({
    walletAddress,
    cursor,
    isLoadMore,
    isFilterAZ
  }: {
    walletAddress: string
    cursor: string | null
    isLoadMore: boolean
    isFilterAZ: boolean
  }) {
    try {
      !isLoadMore && setLoadingCollection(true)
      const res = await NftRepository().getCollectionsByWallets(walletAddress, cursor)
      if (res.data) {
        dispatch(
          setCollectionList({
            collections: res.data['nft'].getCollectionsByWallets.items,
            nextCollection: res.data['nft'].getCollectionsByWallets.next || null,
            isLoadMore,
            isFilterAZ
          })
        )
        dispatch(setIsFetchCollection(true))
        setLoadingCollection(false)
      }
    } catch (error) {
      setLoadingCollection(false)
    }
  }

  async function getNftsByWallets({
    collectionIds,
    walletAddresses,
    cursor,
    isLoadMore,
    limit
  }: {
    collectionIds: number | string
    walletAddresses: string
    cursor: string | null
    isLoadMore: boolean
    limit: number
  }) {
    try {
      !isLoadMore && setLoading(true)
      const res = await NftRepository().getNftsByWallets(
        collectionIds,
        walletAddresses,
        cursor,
        limit
      )
      if (!res.data) return

      if (limit === 1) {
        setNft(res.data['nft'].getNftsByWallets.items[0])
      } else {
        dispatch(
          setNFTList({
            nfts: res.data['nft'].getNftsByWallets.items,
            next: res.data['nft'].getNftsByWallets.next || null,
            isLoadMore,
            count: res.data['nft'].getNftsByWallets.count
          })
        )
        dispatch(setNFTSellected({ nft: res.data['nft'].getNftsByWallets.items[0] }))
      }
    } catch (error) {
      throw new Error(error)
    }
    setLoading(false)
  }

  const mapContracts = (contract) => {
    return {
      address: contract.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [wallet?.account.address]
    }
  }

  async function getTotalBalance(tokenFiles) {
    const chainBalances = []
    for (const file of tokenFiles) {
      if (file.data.length > 0) {
        const tokenArr = []
        let tokenData
        for (const token of file.data) {
          if (token.address === '0x0000000000000000000000000000000000000000') {
            const balance = await getBalance(_wagmiConfig, {
              address: wallet?.account.address as HexString,
              chainId: file.chainId
            })
            tokenData = {
              chainId: file.chainId,
              data: [
                {
                  ...token,
                  amount: balance.formatted,
                  priceUSD: 0
                }
              ]
            }
          } else {
            //@ts-ignore
            tokenArr.push(token)
          }
        }
        const res = await multicall(_wagmiConfig, {
          chainId: file.chainId,
          contracts: [...tokenArr.map((token) => mapContracts(token))]
        })

        res.map((bal, idx) => {
          if (bal.result !== undefined) {
            const decimal = BigInt(10) ** BigInt(tokenArr[idx]['default_decimals'])
            const balance = String((Number(bal.result) / Number(decimal)).toFixed(5))
            tokenData.data.push({
              //@ts-ignore
              ...tokenArr[idx],
              amount: balance,
              priceUSD: 0
            })
          } else {
            tokenData.data.push({
              //@ts-ignore
              ...tokenArr[idx],
              amount: '0.000000',
              priceUSD: 0
            })
          }
        })
        //@ts-ignore
        chainBalances.push(tokenData)
      }
    }
    const coinGeckoIds: Array<string> = []
    chainBalances.map((item) =>
      //@ts-ignore
      item.data.map((bal) => coinGeckoIds.push(`${item.chainId}:${bal.token_symbol}`))
    )

    const res = await WalletConnectRepository(axiosClient).getTokenPrice(coinGeckoIds, 'usd')
    let total = 0
    const tokensUpdated = chainBalances.map((chain, idx) => ({
      //@ts-ignore
      ...chain,
      name: tokenFiles[idx].name,
      chain: tokenFiles[idx].chain,
      //@ts-ignore
      data: chain.data.map((bal) => {
        let priceUSD = 0
        if (res.data) {
          const price = res.data['chain'].getTokenPrice.find(
            //@ts-ignore
            (token) => token.tokenId === `${chain.chainId}:${bal.token_symbol}`
          )
          if (price) {
            priceUSD = price.price.usd ? price.price.usd : 0
          }
        }
        total += priceUSD * Number(bal.amount)
        return {
          ...bal,
          active: bal.active ?? Number(bal.amount) > 0,
          priceUSD: priceUSD
        }
      })
    }))
    dispatch(setTokenFiles({ tokenFiles: tokensUpdated }))
    return total
  }

  async function getExchangeRate() {
    const nativeToken = `${chain?.id}:${chain?.nativeCurrency.symbol}`
    const res = await WalletConnectRepository(axiosClient).getTokenPrice([nativeToken], 'usd')
    return res.data?.['chain'].getTokenPrice[0].price
  }

  return {
    getNft,
    loading,
    getCollections,
    loadingCollection,
    getNftsByWallets,
    getTotalBalance,
    getExchangeRate,
    nft,
    refetchTotal
  }
}
