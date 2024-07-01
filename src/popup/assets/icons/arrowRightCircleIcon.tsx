import React from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'

export function ArrowRightCircleIcon() {
  return (
    <div
      className="p-2 text-center d-flex align-items-center justify-content-center box-light"
      style={{
        // backgroundColor: "rgba(116, 116, 128, 0.12)",
        // border: "1px solid rgba(116, 116, 128, 0.12)",
        borderRadius: '50%',
        width: 54,
        height: 54,
        marginBottom: 4
      }}
    >
      <AiOutlineArrowRight size={22} />
    </div>
  )
}
