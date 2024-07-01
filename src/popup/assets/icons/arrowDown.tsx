import React from "react";

export function ArrowDownIcon() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <filter
          x="-21.5%"
          y="-60.0%"
          width="143.0%"
          height="260.0%"
          filterUnits="objectBoundingBox"
          id="filter-t1awmg7nxd-1"
        >
          <feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur
            stdDeviation="6"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.100000001 0"
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
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        opacity="0.800000012"
      >
        <g id="Chrome-Extension-|-Initial-Screen-|-Default" transform="translate(-509, -41)">
          <g id="Network-Button" transform="translate(392, 33)" filter="url(#filter-t1awmg7nxd-1)">
            <g id="Frame-1708" transform="translate(40, 8)">
              <g id="Icon" transform="translate(77, 0)">
                <path d="M0,0 L24,0 L24,24 L0,24 Z" id="Icon-(Background)"></path>
                <path
                  d="M13.0234375,16.390625 L18.8046875,10.4765625 C19.0390625,10.2421875 19.15625,9.9609375 19.15625,9.6171875 C19.15625,8.921875 18.6015625,8.359375 17.9140625,8.359375 C17.578125,8.359375 17.2578125,8.5 17,8.7578125 L12.0078125,13.9140625 L7.0078125,8.7578125 C6.75,8.5 6.4296875,8.359375 6.0859375,8.359375 C5.3984375,8.359375 4.84375,8.921875 4.84375,9.6171875 C4.84375,9.953125 4.9609375,10.234375 5.1953125,10.4765625 L10.9765625,16.390625 C11.296875,16.7109375 11.6171875,16.8515625 12,16.8515625 C12.390625,16.8515625 12.71875,16.703125 13.0234375,16.390625 Z"
                  fill="#FFFFFF"
                  fillRule="nonzero"
                ></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
