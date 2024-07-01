import { Chain, arbitrum, avalanche, base, bsc, mainnet, optimism, polygon } from 'wagmi/chains'
import arbitrumJson from '../src/popup/assets/Tokens/Arbitrum.json'
import avalancheJson from '../src/popup/assets/Tokens/Avalanche.json'
import bnbJson from '../src/popup/assets/Tokens/BNB.json'
import baseJson from '../src/popup/assets/Tokens/Base.json'
import ethereumJson from '../src/popup/assets/Tokens/Ethereum.json'
import opmainnetJson from '../src/popup/assets/Tokens/OpMainnet.json'
import polygonJson from '../src/popup/assets/Tokens/Polygon.json'

export const customChains: MyChain[] = [
  {
    ...base,
    rpc: 'https://mainnet.base.org/',
    logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg'
  },
  {
    ...mainnet,
    rpc: 'https://rpc.ankr.com/eth',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzI1MjkyRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTguMTkgMTQuNzcgMTQgMTguMjFsNS44LTMuNDQtNS44IDguMTktNS44MS04LjE5WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0xNCAxNi45My01LjgxLTMuNDRMMTQgNC4zNGw1LjgxIDkuMTVMMTQgMTYuOTNaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTQuNzciIHkyPSIyMi45NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K'
  },
  {
    ...polygon,
    rpc: 'https://rpc.ankr.com/polygon',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iQSIgeDE9Ii0xOC4yNzUlIiB4Mj0iODQuOTU5JSIgeTE9IjguMjE5JSIgeTI9IjcxLjM5MyUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNhMjI5YzUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3YjNmZTQiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgaWQ9IkIiIGN4PSIxNCIgY3k9IjE0IiByPSIxNCIvPjwvZGVmcz48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJDIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNCIi8+PC9tYXNrPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0idXJsKCNBKSIgZD0iTS0xLjMyNi0xLjMyNmgzMC42NTF2MzAuNjUxSC0xLjMyNnoiIG1hc2s9InVybCgjQykiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTguMDQ5IDE3LjAyMWwzLjk2LTIuMjg3YS42ODEuNjgxIDAgMCAwIC4zNC0uNTg5VjkuNTcyYS42ODMuNjgzIDAgMCAwLS4zNC0uNTlsLTMuOTYtMi4yODZhLjY4Mi42ODIgMCAwIDAtLjY4IDBsLTMuOTYgMi4yODdhLjY4Mi42ODIgMCAwIDAtLjM0LjU4OXY4LjE3M0wxMC4yOSAxOS4zNWwtMi43NzctMS42MDR2LTMuMjA3bDIuNzc3LTEuNjA0IDEuODMyIDEuMDU4VjExLjg0bC0xLjQ5Mi0uODYxYS42ODEuNjgxIDAgMCAwLS42OCAwbC0zLjk2IDIuMjg3YS42ODEuNjgxIDAgMCAwLS4zNC41ODl2NC41NzNjMCAuMjQyLjEzLjQ2OC4zNC41OWwzLjk2IDIuMjg2YS42OC42OCAwIDAgMCAuNjggMGwzLjk2LTIuMjg2YS42ODIuNjgyIDAgMCAwIC4zNC0uNTg5di04LjE3NGwuMDUtLjAyOCAyLjcyOC0xLjU3NSAyLjc3NyAxLjYwM3YzLjIwOGwtMi43NzcgMS42MDMtMS44My0xLjA1NnYyLjE1MWwxLjQ5Ljg2YS42OC42OCAwIDAgMCAuNjggMHoiLz48L2c+PC9nPjwvc3ZnPg=='
  },
  {
    ...optimism,
    rpc: 'https://rpc.ankr.com/optimism',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjRkYzMTMxIiByeD0iMTQiLz48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9InVybCgjYSkiIGZpbGwtb3BhY2l0eT0iLjMiIHJ4PSIxNCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05LjIyIDE4LjM1YzIuNyAwIDQuODYtMi4yIDQuODYtNS4zOCAwLTIuMTktMS40Ny0zLjgtMy45OC0zLjgtMi43MiAwLTQuODUgMi4yLTQuODUgNS4zOCAwIDIuMiAxLjUgMy44IDMuOTcgMy44Wm0uODMtNy4zNWMxLjA2IDAgMS43NC44MSAxLjc0IDIuMSAwIDEuOS0xLjExIDMuNDItMi41MSAzLjQyLTEuMDYgMC0xLjc0LS44Mi0xLjc0LTIuMSAwLTEuODkgMS4xMS0zLjQyIDIuNS0zLjQyWm02LjM4LTEuNjgtMS44OCA4Ljg4aDIuMjZsLjU1LTIuNmgxLjQ3YzIuNDMgMCA0LjAxLTEuMzggNC4wMS0zLjYgMC0xLjYxLTEuMTctMi42OC0zLjEtMi42OGgtMy4zWm0xLjkgMS43NGguOTRjLjgzIDAgMS4zLjM4IDEuMyAxLjE0IDAgMS0uNjggMS43LTEuNzQgMS43aC0xLjExbC42LTIuODRaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+Cg=='
  },
  {
    ...arbitrum,
    rpc: 'https://rpc.ankr.com/arbitrum',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI2LjYiIGhlaWdodD0iMjYuNiIgeD0iLjciIHk9Ii43IiBmaWxsPSIjMkQzNzRCIiBzdHJva2U9IiM5NkJFREMiIHN0cm9rZS13aWR0aD0iMS40IiByeD0iMTMuMyIvPjxtYXNrIGlkPSJhIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHg9IjAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiPjxyZWN0IHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0iI0M0QzRDNCIgcng9IjE0Ii8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiMyOEEwRjAiIGQ9Im0xNC4wODYxIDE4LjYwNDEgNi41MDE0IDEwLjIyMzkgNC4wMDU3LTIuMzIxMy03Ljg2LTEyLjM5NDMtMi42NDcxIDQuNDkxN1ptMTMuMDc0NCAzLjQ2OTItLjAwMy0xLjg1OTktNy4zMDY0LTExLjQwNy0yLjMwODcgMy45MTczIDcuMDkxIDExLjQzMDMgMi4xNzItMS4yNTg2YS45NjI4Ljk2MjggMCAwIDAgLjM1NTUtLjcwMDlsLS4wMDA0LS4xMjEyWiIvPjxyZWN0IHdpZHRoPSIyNS45IiBoZWlnaHQ9IjI1LjkiIHg9IjEuMDUiIHk9IjEuMDUiIGZpbGw9InVybCgjYikiIGZpbGwtb3BhY2l0eT0iLjMiIHN0cm9rZT0iIzk2QkVEQyIgc3Ryb2tlLXdpZHRoPSIyLjEiIHJ4PSIxMi45NSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0uMzYzNCAyOC4yMjA3LTMuMDctMS43Njc0LS4yMzQtLjgzMzNMNy43NDYxIDkuMDE5NGMuNzI5OC0xLjE5MTMgMi4zMTk3LTEuNTc1IDMuNzk1Ny0xLjU1NDFsMS43MzIzLjA0NTdMLjM2MzQgMjguMjIwN1pNMTkuMTY1NSA3LjUxMWwtNC41NjUzLjAxNjZMMi4yNCAyNy45NTMzbDMuNjEwMyAyLjA3ODguOTgxOC0xLjY2NTJMMTkuMTY1NSA3LjUxMVoiLz48L2c+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+Cg=='
  },
  {
    ...avalanche,
    rpc: 'https://rpc.ankr.com/avalanche',
    logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg'
  },
  {
    ...bsc,
    rpc: 'https://rpc.ankr.com/bsc',
    logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg'
  }
]

export type Token = {
  token_symbol: string
  coin_symbol: string
  name: string
  chainId: string
  address: string
  default_decimals: string
  coingecko_token_id: string
  coin_main_hex_color: string
  about: string
  website: string
  whitepaper: string
  content: string
  twitter: string
  reddit: string
  telegram: string
  blockchain_explorer: string
  coingecko: string
  messari: string
  erc20_address: string
  logoURI: string
  active?: boolean
}

export type TokenFile = {
  chainId: number
  name: string
  data: Token[]
  chain: MyChain
}

export const tokenFiles: TokenFile[] = [
  {
    chainId: 8453,
    name: 'Base',
    //@ts-ignore
    data: baseJson,
    chain: {
      ...base,
      rpc: 'https://mainnet.base.org/',
      logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg'
    }
  },
  {
    chainId: 1,
    name: 'Ethereum',
    //@ts-ignore
    data: ethereumJson,
    chain: {
      ...mainnet,
      rpc: 'https://rpc.ankr.com/eth',
      logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzI1MjkyRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTguMTkgMTQuNzcgMTQgMTguMjFsNS44LTMuNDQtNS44IDguMTktNS44MS04LjE5WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0xNCAxNi45My01LjgxLTMuNDRMMTQgNC4zNGw1LjgxIDkuMTVMMTQgMTYuOTNaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTQuNzciIHkyPSIyMi45NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K'
    }
  },
  {
    chainId: 137,
    name: 'Polygon',
    //@ts-ignore
    data: polygonJson,
    chain: {
      ...polygon,
      rpc: 'https://rpc.ankr.com/polygon',
      logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iQSIgeDE9Ii0xOC4yNzUlIiB4Mj0iODQuOTU5JSIgeTE9IjguMjE5JSIgeTI9IjcxLjM5MyUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNhMjI5YzUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3YjNmZTQiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgaWQ9IkIiIGN4PSIxNCIgY3k9IjE0IiByPSIxNCIvPjwvZGVmcz48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJDIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNCIi8+PC9tYXNrPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0idXJsKCNBKSIgZD0iTS0xLjMyNi0xLjMyNmgzMC42NTF2MzAuNjUxSC0xLjMyNnoiIG1hc2s9InVybCgjQykiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTguMDQ5IDE3LjAyMWwzLjk2LTIuMjg3YS42ODEuNjgxIDAgMCAwIC4zNC0uNTg5VjkuNTcyYS42ODMuNjgzIDAgMCAwLS4zNC0uNTlsLTMuOTYtMi4yODZhLjY4Mi42ODIgMCAwIDAtLjY4IDBsLTMuOTYgMi4yODdhLjY4Mi42ODIgMCAwIDAtLjM0LjU4OXY4LjE3M0wxMC4yOSAxOS4zNWwtMi43NzctMS42MDR2LTMuMjA3bDIuNzc3LTEuNjA0IDEuODMyIDEuMDU4VjExLjg0bC0xLjQ5Mi0uODYxYS42ODEuNjgxIDAgMCAwLS42OCAwbC0zLjk2IDIuMjg3YS42ODEuNjgxIDAgMCAwLS4zNC41ODl2NC41NzNjMCAuMjQyLjEzLjQ2OC4zNC41OWwzLjk2IDIuMjg2YS42OC42OCAwIDAgMCAuNjggMGwzLjk2LTIuMjg2YS42ODIuNjgyIDAgMCAwIC4zNC0uNTg5di04LjE3NGwuMDUtLjAyOCAyLjcyOC0xLjU3NSAyLjc3NyAxLjYwM3YzLjIwOGwtMi43NzcgMS42MDMtMS44My0xLjA1NnYyLjE1MWwxLjQ5Ljg2YS42OC42OCAwIDAgMCAuNjggMHoiLz48L2c+PC9nPjwvc3ZnPg=='
    }
  },
  {
    chainId: 10,
    name: 'OP Mainnet',
    //@ts-ignore
    data: opmainnetJson,
    chain: {
      ...optimism,
      rpc: 'https://rpc.ankr.com/optimism',
      logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjRkYzMTMxIiByeD0iMTQiLz48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9InVybCgjYSkiIGZpbGwtb3BhY2l0eT0iLjMiIHJ4PSIxNCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05LjIyIDE4LjM1YzIuNyAwIDQuODYtMi4yIDQuODYtNS4zOCAwLTIuMTktMS40Ny0zLjgtMy45OC0zLjgtMi43MiAwLTQuODUgMi4yLTQuODUgNS4zOCAwIDIuMiAxLjUgMy44IDMuOTcgMy44Wm0uODMtNy4zNWMxLjA2IDAgMS43NC44MSAxLjc0IDIuMSAwIDEuOS0xLjExIDMuNDItMi41MSAzLjQyLTEuMDYgMC0xLjc0LS44Mi0xLjc0LTIuMSAwLTEuODkgMS4xMS0zLjQyIDIuNS0zLjQyWm02LjM4LTEuNjgtMS44OCA4Ljg4aDIuMjZsLjU1LTIuNmgxLjQ3YzIuNDMgMCA0LjAxLTEuMzggNC4wMS0zLjYgMC0xLjYxLTEuMTctMi42OC0zLjEtMi42OGgtMy4zWm0xLjkgMS43NGguOTRjLjgzIDAgMS4zLjM4IDEuMyAxLjE0IDAgMS0uNjggMS43LTEuNzQgMS43aC0xLjExbC42LTIuODRaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+Cg=='
    }
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    //@ts-ignore
    data: arbitrumJson,
    chain: {
      ...arbitrum,
      rpc: 'https://rpc.ankr.com/arbitrum',
      logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI2LjYiIGhlaWdodD0iMjYuNiIgeD0iLjciIHk9Ii43IiBmaWxsPSIjMkQzNzRCIiBzdHJva2U9IiM5NkJFREMiIHN0cm9rZS13aWR0aD0iMS40IiByeD0iMTMuMyIvPjxtYXNrIGlkPSJhIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHg9IjAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiPjxyZWN0IHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0iI0M0QzRDNCIgcng9IjE0Ii8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiMyOEEwRjAiIGQ9Im0xNC4wODYxIDE4LjYwNDEgNi41MDE0IDEwLjIyMzkgNC4wMDU3LTIuMzIxMy03Ljg2LTEyLjM5NDMtMi42NDcxIDQuNDkxN1ptMTMuMDc0NCAzLjQ2OTItLjAwMy0xLjg1OTktNy4zMDY0LTExLjQwNy0yLjMwODcgMy45MTczIDcuMDkxIDExLjQzMDMgMi4xNzItMS4yNTg2YS45NjI4Ljk2MjggMCAwIDAgLjM1NTUtLjcwMDlsLS4wMDA0LS4xMjEyWiIvPjxyZWN0IHdpZHRoPSIyNS45IiBoZWlnaHQ9IjI1LjkiIHg9IjEuMDUiIHk9IjEuMDUiIGZpbGw9InVybCgjYikiIGZpbGwtb3BhY2l0eT0iLjMiIHN0cm9rZT0iIzk2QkVEQyIgc3Ryb2tlLXdpZHRoPSIyLjEiIHJ4PSIxMi45NSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0uMzYzNCAyOC4yMjA3LTMuMDctMS43Njc0LS4yMzQtLjgzMzNMNy43NDYxIDkuMDE5NGMuNzI5OC0xLjE5MTMgMi4zMTk3LTEuNTc1IDMuNzk1Ny0xLjU1NDFsMS43MzIzLjA0NTdMLjM2MzQgMjguMjIwN1pNMTkuMTY1NSA3LjUxMWwtNC41NjUzLjAxNjZMMi4yNCAyNy45NTMzbDMuNjEwMyAyLjA3ODguOTgxOC0xLjY2NTJMMTkuMTY1NSA3LjUxMVoiLz48L2c+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+Cg=='
    }
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    //@ts-ignore
    data: avalancheJson,
    chain: {
      ...avalanche,
      rpc: 'https://rpc.ankr.com/avalanche',
      logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg'
    }
  },
  {
    chainId: 56,
    name: 'BNB Smart Chain',
    //@ts-ignore
    data: bnbJson,
    chain: {
      ...bsc,
      rpc: 'https://rpc.ankr.com/bsc',
      logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg'
    }
  }
]

export const dataAllToken = [
  ...ethereumJson,
  ...polygonJson,
  ...opmainnetJson,
  ...arbitrumJson,
  ...avalancheJson,
  ...baseJson,
  ...bnbJson
]

export type MyChain = Chain & { rpc: string; logo: string }

export const getChain = async (id: number): Promise<MyChain | undefined> => {
  //@ts-ignore
  const { VITE_AA_API_KEY, VITE_AA_WALLET_API } = import.meta.env
  const result: MyChain | undefined = customChains.find((chain) => chain.id === id)
  if (result == undefined) {
    return result
  }
  const res = await fetch(`${VITE_AA_WALLET_API}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query MyQuery {
          chain {
            getSupportedChains(chainIds: ${id}) {
              rpc
            }
          }
        }
      `
    }),
    headers: {
      'x-api-key': VITE_AA_API_KEY,
      'content-type': 'application/json'
    }
  })
  const data = await res.json()
  if (data.errors) return result

  return {
    ...result,
    rpc: data.data.chain.getSupportedChains[0].rpc
  }
}

export const getChainById = (id: number) => {
  return customChains.find((chain) => chain.id === id)
}
