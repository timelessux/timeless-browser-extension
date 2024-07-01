import React from 'react'
import { ArrowDownIcon } from './arrowDown'

export function ArrowDownCircleIcon() {
  return (
    <div
      style={{
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255, 0.1)',
        width: 26,
        height: 26,
        textAlign: 'center'
      }}
      className="hover cursor-pointer"
    >
      <ArrowDownIcon />
    </div>
  )
}
