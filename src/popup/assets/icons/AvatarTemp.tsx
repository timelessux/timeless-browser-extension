import React from 'react'

type AvatarTempProps = { size?: number }

export const AvatarTemp = (props: AvatarTempProps) => {
  const { size = 24 } = props
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        background: 'rgb(252, 92, 84)',
        width: size,
        height: size,
        borderRadius: '50%',
        fontSize: size ? size / 2 : 12
      }}
    >
      🎈
    </div>
  )
}
