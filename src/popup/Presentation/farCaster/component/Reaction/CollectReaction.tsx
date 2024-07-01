import React, { useEffect, useState } from 'react'
import { BsCollection, BsFillCollectionFill } from 'react-icons/bs'
import { numberFormatter } from '../../../../../../utils/textConvert'
import { useFarcasterViewModel } from '../../FarcasterViewModel'
import { EStatusReact } from '../../../../../../ts'
import { usePageLoading } from '../../../../context/LoadingContext'

type Props = {
  collectCount: number
  isCollectedByMe: boolean
  disabled: boolean
  postId?: string
}

const CollectReaction = ({ collectCount, isCollectedByMe, disabled, postId }: Props) => {
  const { openMessage, destroyMessage } = usePageLoading()
  const { collect, collecting } = useFarcasterViewModel()
  const [collected, setCollected] = useState<boolean>(isCollectedByMe)
  const [count, setCount] = useState<number>(collectCount)

  useEffect(() => {
    if (collecting) {
      openMessage('loading', 'Collecting...')
    }
  }, [collecting])

  const handleCollect = async () => {
    if (disabled) return
    if (collected) {
      openMessage('error', `You already collected it!`)
      return
    }
    if (postId && !collected) {
      setCollected(!collected)
      setCount(count + 1)
      const res = await collect(postId)
      if (res === EStatusReact.DONE) {
        setCollected(true)
        destroyMessage()
        openMessage('success', 'Success')
      } else {
        setCollected(false)
        destroyMessage()
        openMessage('error', 'Fail')
        setCount(collectCount)
      }
    }
  }

  return (
    <div
      className="collect-reaction cursor-pointer"
      onClick={(e) => {
        handleCollect(), e.stopPropagation()
      }}
    >
      <span>
        {/* {collected ? (
          <BsFillCollectionFill color="#DB2777" size={18} />
        ) : ( */}
        <BsCollection size={18} />
        {/* )} */}
      </span>
      <span className="counter align-middle ms-2" style={{ color: '#fff' }}>
        {numberFormatter(count, 1)}
      </span>
    </div>
  )
}

export default CollectReaction
