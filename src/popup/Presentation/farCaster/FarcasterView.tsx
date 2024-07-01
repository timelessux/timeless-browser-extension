import { switchChain } from '@wagmi/core'
import { Tabs, TabsProps } from 'antd'
import React, { useEffect } from 'react'
import { customChains } from '../../../../utils/mapChains'
import { Publication } from '../../Domain/Model/Publication'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { switchWalletNetwork } from '../../redux/slices/wallet/wallet.slice'
import FullscreenMediaModal from '../modal/FullScreenMediaModal'
import { AudienceModal } from '../modal/PostModal/AudienceModal'
import { PostModal } from '../modal/PostModal/index'
import { ReplyModal } from '../modal/ReplyModal'
import ShareModal from '../modal/ShareModal'
import FollowingTabView from './component/FollowingTab/FollowingTabView'
import ForyouTabView from './component/ForYouTab/ForyouTabView'
import PopularTabView from './component/PopularTab/PopularTabView'
import FarcasterCard from './component/FarcasterCard'
import { fakeSocialPost } from './fakeData/fakeSocialPost'
import { _wagmiConfig } from '../../configs/wagmiConfig'

export interface Feed {
  foryou: Array<Publication>
  following: Array<Publication>
  popular: Array<Publication>
}

type Props = {
  setSelectedPost: React.Dispatch<React.SetStateAction<Publication | undefined>>
}

function FarcasterView({ setSelectedPost }: Props) {
  const dispatch = useAppDispatch()

  const { stepSellected } = useAppSelector((state) => state.tutorial)

  const switchToPolygon = () => {
    switchChain(_wagmiConfig, { chainId: 137 })
  }

  useEffect(() => {
    if (stepSellected && stepSellected.id === 'social') return
    switchToPolygon()
    const chain = customChains.find((c) => c.id === 137)
    if (chain) dispatch(switchWalletNetwork(chain))
  }, [])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'For you',
      children: <ForyouTabView setSelectedPost={setSelectedPost} />
    },
    {
      key: '2',
      label: 'Following',
      children: <FollowingTabView setSelectedPost={setSelectedPost} />
    },
    {
      key: '3',
      label: 'Popular',
      children: <PopularTabView setSelectedPost={setSelectedPost} />
    }
  ]

  if (stepSellected && stepSellected.id === 'social') {
    const items: TabsProps['items'] = [
      {
        key: '1',
        label: 'For you',
        children: <FarcasterCard post={fakeSocialPost} disabled={false} lensId={null} />
      },
      {
        key: '2',
        label: 'Following',
        children: <></>
      },
      {
        key: '3',
        label: 'Algo B',
        children: <></>
      }
    ]
    return (
      <div className="social-view d-flex flex-column h-100 w-100">
        <Tabs defaultActiveKey="1" items={items} tabBarGutter={4} />
      </div>
    )
  }

  return (
    <div className="social-view d-flex flex-column h-100 w-100">
      <Tabs defaultActiveKey="1" items={items} tabBarGutter={4} />
      <FullscreenMediaModal />
      <PostModal />
      <AudienceModal />
      <ShareModal />
      <ReplyModal />
    </div>
  )
}

export default FarcasterView
