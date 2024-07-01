import React from 'react'

type TimelessXLogoProps = {
  className?: string
  onClick?: () => void
}

const TimelessXLogo = (props: TimelessXLogoProps) => {
  return (
    <svg
      onClick={props.onClick}
      className={props.className}
      width="133.493652px"
      height="27px"
      viewBox="0 0 133.493652 27"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <filter
          x="-3.4%"
          y="-16.7%"
          width="106.7%"
          height="133.3%"
          filterUnits="objectBoundingBox"
          id="filter-jm721cezy2-1"
        >
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur
            stdDeviation="1.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Flex-your-prized-possession" transform="translate(-67, -30)">
          <g id="Group-8" filter="url(#filter-jm721cezy2-1)" transform="translate(67, 30)">
            <g
              id="Logo"
              fill="#FFFFFF"
              fontFamily="Silkscreen-Regular, Silkscreen"
              fontSize="21"
              fontWeight="normal"
            >
              <g id="Group">
                <text id="Timeless">
                  <tspan x="0" y="22">
                    Timeless
                  </tspan>
                </text>
              </g>
            </g>
            <image
              id="ONLY-X-Copy"
              x="115.493652"
              y="6"
              width="18"
              height="18"
            ></image>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default TimelessXLogo