import React, { ReactNode } from 'react'
import { useAppDispatch } from '../../../redux/hook'
import { setVisibleHeader } from '../../../redux/slices/slide/slide.slice'

type Props = {
  title: string
  icon: ReactNode
  onClick: () => void
  className?: string
  active: boolean
  collapsed: boolean
  isHover?: boolean
  disable?: boolean
}

const MenuItem = ({
  title,
  icon,
  onClick,
  className,
  active,
  collapsed,
  isHover = true,
  disable = false
}: Props) => {
  const dispatch = useAppDispatch()
  return (
    <div
      className={`menu-item d-flex align-items-center ${active ? '--active' : ''} ${
        className ? className : ''
      } ${isHover && !disable ? 'hover' : 'none-hover'}
      ${collapsed ? 'open-menu-item --colapsed' : 'close-menu-item justify-content-center'}

      ${disable ? '' : 'cursor-pointer'}
      `}
      onClick={() => {
        !disable && onClick()
        dispatch(setVisibleHeader({ isVisibleHeader: true }))
      }}
    >
      <div className="icon">{icon}</div>
      {collapsed && <div className="title ms-3">{title}</div>}
    </div>
  )
}

export default MenuItem
