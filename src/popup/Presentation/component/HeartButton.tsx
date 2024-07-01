import React from 'react'
import { HeartIcon } from '../../assets/icons/HeartIcon'

type HeartButtonProps = {
  className?: string
  onClick?: () => void
  initialState: boolean
}

const HeartButton = (props: HeartButtonProps) => {
  const { className, onClick, initialState } = props

  const color = initialState ? 'red' : 'white'
  const backgroundColor = initialState ? 'white' : undefined

  return (
    <button
      type="button"
      style={{ backgroundColor }}
      onClick={() => onClick && onClick()}
      className={`defaultHeartButtonStyle ${className}`}
    >
      <HeartIcon color={color} isActive={initialState} />
    </button>
  )
}

export default HeartButton
