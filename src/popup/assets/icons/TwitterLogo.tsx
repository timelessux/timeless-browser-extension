import React, { CSSProperties } from 'react'

function TwitterLogo({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.176 0H16.936L10.9061 7.62474L18 18H12.4454L8.09511 11.7073L3.11727 18H0.355395L6.80498 9.84464L0 0H5.69528L9.62772 5.75161L14.176 0ZM13.2073 16.1722H14.7367L4.86432 1.73182H3.22323L13.2073 16.1722Z"
        fill="#CCCCCC"
      />
    </svg>
  )
}

export default TwitterLogo
