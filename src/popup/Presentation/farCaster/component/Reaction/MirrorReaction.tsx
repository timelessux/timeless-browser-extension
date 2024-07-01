import React, { useEffect, useState } from 'react'
import { VscArrowSwap } from 'react-icons/vsc'
import { numberFormatter } from '../../../../../../utils/textConvert'
import { useFarcasterViewModel } from '../../FarcasterViewModel'
import { usePageLoading } from '../../../../context/LoadingContext'
import { EStatusReact } from '../../../../../../ts'

type Props = {
  mirrorCount: number
  isMirroredByMe: boolean
  disabled: boolean
  postId?: string
}

const MirrorReaction = ({ mirrorCount, isMirroredByMe, disabled, postId }: Props) => {
  const { mirror, mirroring } = useFarcasterViewModel()
  const { openMessage, destroyMessage } = usePageLoading()
  const [mirrored, setMirrored] = useState<boolean>(isMirroredByMe)
  const [count, setCount] = useState<number>(mirrorCount)

  useEffect(() => {
    if (disabled) return
    if (mirroring) {
      openMessage('loading', 'Mirroring...')
    }
  }, [mirroring])

  const handleMirror = async () => {
    if (mirrored) {
      openMessage('error', `You already mirrored it!`)
      return
    }
    if (postId && !mirrored) {
      setMirrored(!mirrored)
      setCount(count + 1)
      const res = await mirror(postId, '', '')
      if (res && res.status === EStatusReact.DONE) {
        destroyMessage()
        openMessage('success', 'Success')
        setMirrored(true)
      } else {
        destroyMessage()
        openMessage('error', 'Error')
        setMirrored(false)
        setCount(mirrorCount)
      }
    }
  }

  return (
    <div
      className="mirror-reaction cursor-pointer"
      onClick={(e) => {
        handleMirror(), e.stopPropagation()
      }}
    >
      <span>
        <VscArrowSwap color="#fff" size={18} />
      </span>
      <span className="counter align-middle ms-2" style={{ color: '#fff' }}>
        {numberFormatter(count, 1)}
      </span>
    </div>
  )
}

export default MirrorReaction
