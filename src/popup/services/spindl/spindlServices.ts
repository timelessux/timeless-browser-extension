import { TSpindl } from '../../../../ts/articleState'
import { spindlAxiosClient } from './spindlAxios'

type getListSpindlRequestProps ={
  address: string
}

export const getListSpindlRequest = async ({address}:getListSpindlRequestProps): Promise<{ data: TSpindl[]; error?: string }> => {
  try {
    const { data } = await spindlAxiosClient.get<{ items: TSpindl[] }, any>({
      path: `spindl/explorer/?address=${address}`
    })

    if (data.items) return { data: data.items }
    return { data: [] }
  } catch (error) {
    return error?.error
  }
}
