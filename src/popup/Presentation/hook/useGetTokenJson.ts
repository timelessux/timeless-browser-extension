import { Chain } from 'wagmi/chains'
import { TToken } from '../../../../ts/types'
import { dataAllToken, tokenFiles } from '../../../../utils/mapChains'

export const useGetTokenJson = ({
  chain
}: {
  chain?: Chain & {
    unsupported?: boolean | undefined
  }
}) => {
  function getJsonToken({ chainName }: { chainName?: string }): TToken[] {
    //@ts-ignore
    if (!chainName) return null

    const chain = tokenFiles.find((token) => token.name === chainName)
    const nativeSymbol = chain && chain.data[0]['token_symbol']
    const res = chain
      ? chain.data.filter((token) => !token['token_symbol'].startsWith(`W${nativeSymbol}`))
      : []
    //@ts-ignore
    return res
  }

  function getToken({ chainSymbol }: { chainSymbol?: string }) {
    const tokens: Array<TToken> = getJsonToken({ chainName: chain?.name })
    let token: TToken | undefined = undefined
    if (tokens) {
      token = tokens.find(
        (token) => token.token_symbol.toUpperCase() === chainSymbol?.toUpperCase()
      )
    }
    return token
  }

  function getTokenByName({ name }: { name: string }) {
    const similarNames = dataAllToken.filter((item) => {
      const itemNameLower = item.name.toLowerCase()
      const inputNameLower = name.toLowerCase()

      return itemNameLower.indexOf(inputNameLower) !== -1
    })

    return similarNames
  }

  return {
    getJsonToken,
    getToken,
    getTokenByName
  }
}
