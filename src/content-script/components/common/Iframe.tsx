import React, { useState } from 'react'
import { createPortal } from 'react-dom'

export default function IFrame({
  id,
  children,
  className,
  style,
  width,
  height
}: {
  id?: string
  children
  className?: string
  style?
  width?: string
  height?: string
}) {
  const [ref, setRef] = useState()
  const container = ref?.contentWindow?.document?.body

  return (
    <iframe
      id={id}
      width={width}
      height={height}
      className={className}
      style={{ border: 'none', ...style }}
      ref={setRef}
    >
      {container && createPortal(children, container)}
    </iframe>
  )
}
