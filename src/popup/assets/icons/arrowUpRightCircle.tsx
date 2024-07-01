import React from 'react'
import { PiArrowUpRightBold } from 'react-icons/pi'

type ArrowUpRightCircleProps = { size: number; color: string }

export const ArrowUpRightCircle = (props: ArrowUpRightCircleProps) => {
  return (
    <div
      style={{
        padding: 5,
        borderRadius: '50%',
        border: '1px solid #ffffff4d',
        background: 'rgba(149,149,149,0.25)'
      }}
    >
      <PiArrowUpRightBold size={props.size} color={props.color} />
    </div>
  )
}
