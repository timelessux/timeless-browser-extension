/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from "react";
import { Account, Chain, PublicClient, WalletClient, createPublicClient, createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { getChain } from "../../../utils/mapChains";

interface WalletContextType {
  account: Account | `0x${string}`
  getAccount: (privateKey) => Account
  initPublicClient: (chain: Chain | undefined) => Promise<PublicClient>
  initWalletClient: (chain: Chain | undefined, account: Account | `0x${string}`) => Promise<WalletClient>
}

const WalletContext = createContext<WalletContextType>(null!);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | `0x${string}`>()

  const initPublicClient = async (chain) => {
    const selectedChain = await getChain(chain.id)
    return createPublicClient({
      chain: selectedChain,
      transport: http(selectedChain?.rpc)
    })
  }

  const getAccount = (privateKey) => {
    const account = mnemonicToAccount(privateKey)
    setAccount(account)
    return account
  }

  const initWalletClient = async (chain, account) => {
    const selectedChain = await getChain(chain.id)
    return createWalletClient({
      account: account,
      chain: selectedChain,
      transport: http(selectedChain?.rpc)
    })
  }

  const value = {
    account,
    getAccount,
    initPublicClient,
    initWalletClient
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
