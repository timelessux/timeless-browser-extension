import { Spin, SpinProps } from 'antd'
import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

export const PageLoader = () => {
  return (
    <div className="tl-page-loader position-absolute top-50 start-50 translate-middle">
      <Loader size="large" />
    </div>
  )
}

export const Loader = ({ size }: SpinProps) => {
  return (
    <Spin
      size={size}
      indicator={<LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />}
    />
  )
}
