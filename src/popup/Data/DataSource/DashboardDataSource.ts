/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AxiosResponse } from 'axios'
import BaseService from '../../../../services/axios'
import { getData } from '../../../../utils/chromeStorage'
import { NotificationResponse } from '../../Domain/Model/Notification'
import { DashboardDataSource } from './DataSource'

//@ts-ignore
const { VITE_APP_URI, VITE_AA_WALLET_API } = import.meta.env

export type DailyDataDTO = {
  data: {
    extension: {
      getDailyData: {
        image: {
          createdAt: string
          imageId: string
          updatedAt: string
          url: string
        }
        quote: {
          content: string
          author: string
          quoteId: string
          createdAt: string
          updatedAt: string
        }
      }
    }
  }
}

export class DashboardDataSourceImpl implements DashboardDataSource {
  async getNotification(profileId: string, cursor: string): Promise<NotificationResponse> {
    const wallet = await getData('account')
    const url = `${VITE_APP_URI}/api/v4/notifications/social/history/?profile_id=${profileId}&limit=10${
      cursor !== '' ? `&cursor=${cursor}` : ''
    }`
    const response = await fetch(url, {
      headers: {
        'x-app-version': '0.2.6-2',
        'x-device-id': '2DF9DD39-9EC8-493D-AC7B-BFE407353398',
        'x-app-platform': 'ios',
        'x-wallet-signature': wallet?.signature,
        'x-wallet-address': wallet?.account.address,
        'x-siwe-message': wallet?.siweMessage
      }
    })

    return await response.json()
  }

  async getDailyData(
    installationId: string,
    timeZone: string
  ): Promise<DailyDataDTO['data']['extension']['getDailyData']> {
    const query = `query MyQuery {
        extension {
          getDailyData(request: {appId: "${installationId}", timezone: "${timeZone}"}) {
            image {
              createdAt
              imageId
              updatedAt
              url
            }
            quote {
              content
              author
              quoteId
              createdAt
              updatedAt
            }
          }
        }
      }`
    const axiosClient = new BaseService()
    const response: AxiosResponse<DailyDataDTO> = await axiosClient.post({
      path: `${VITE_AA_WALLET_API}/graphql`,
      data: JSON.stringify({ query })
    })
    return response.data.data.extension.getDailyData
  }

  getMantras(): Array<string> {
    return [
      'Hakuna matata',
      'Carpe diem',
      `Don't take life too seriously, nobody gets out alive`,
      `Don't sweat the small stuff`,
      'You can never be wrong doing the right thing',
      'Make today the best day ever',
      'Live each day as if it were your last',
      `Don't cry over spilled milk`,
      'Live less out of habit and more out of intent',
      `Don't worry, be happy`,
      'Practice kindness',
      'Appreciate your progress',
      'I create my own path and walk it with joy',
      'My positive thoughts guide me to new heights',
      'I am conquering my fears and becoming stronger each day',
      'I will have a good day, because it’s my choice',
      'I am not afraid to be wrong',
      `I'm not lazy, I'm just on energy-saving mode`,
      `I'm not perfect, I'm just perfectly me`,
      `I'm not bossy, I'm just a good leader`,
      `I'm not a mess, I'm a masterpiece`,
      `I'm not lazy, I'm selective about my activities`,
      `I'm not sarcastic, I'm just honest`,
      `I'm not weird, I'm just uniquely awesome`,
      `I'm not perfect, I'm perfectly me`,
      `I'm not bossy, I'm just persuasive`,
      `I'm not crazy, I'm just creatively sane`,
      'Keep calm and carry on',
      'Seize the day',
      'Let go and let the good times roll',
      'Life is too short to be serious all the time',
      'Laugh often, love much, and live life to the fullest',
      'The only thing constant in life is change',
      'Be yourself, everyone else is already taken',
      'You are amazing, never forget that',
      'You can do anything you set your mind to',
      'Believe in yourself and your dreams',
      'Follow your heart and never give up on your dreams',
      'Be brave, be kind, and be true to yourself',
      'Be the change you want to see in the world',
      `You can't change the past, but you can create a better future`,
      `Don't be afraid to fail, failure is the stepping stone to success`,
      `It's not about the destination, it's about the journey`,
      'Find your happy place and go there often',
      'Surround yourself with positive people who lift you up',
      'Be grateful for what you have, and never stop dreaming'
    ]
  }
}
