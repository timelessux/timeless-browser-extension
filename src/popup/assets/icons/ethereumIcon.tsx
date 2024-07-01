import React from "react";

export function EthereumIcon() {
  return (
    <svg
      width="24.0000172px"
      height="24.0000172px"
      viewBox="0 0 24.0000172 24.0000172"
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
          id="filter-ld1x2nrrzs-1"
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
        <linearGradient
          x1="1.11022302e-14%"
          y1="2.77555756e-14%"
          x2="49.9999993%"
          y2="99.9999985%"
          id="linearGradient-ld1x2nrrzs-2"
        >
          <stop stopColor="#FFFFFF" offset="0%"></stop>
          <stop stopColor="#FFFFFF" stopOpacity="0" offset="100%"></stop>
        </linearGradient>
        <path
          d="M24.0000172,12 C24.0000172,5.37258666 18.6274305,0 12,0 C5.37258666,0 0,5.37258666 0,12 C0,18.6274305 5.37258666,24.0000172 12,24.0000172 C18.6274305,24.0000172 24.0000172,18.6274305 24.0000172,12 Z"
          id="path-ld1x2nrrzs-3"
        ></path>
        <linearGradient
          x1="50%"
          y1="3.06161713e-15%"
          x2="50%"
          y2="100%"
          id="linearGradient-ld1x2nrrzs-4"
        >
          <stop stopColor="#FFFFFF" offset="0%"></stop>
          <stop stopColor="#FFFFFF" stopOpacity="0.899999976" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        opacity="0.800000012"
      >
        <g id="Chrome-Extension-|-Initial-Screen-|-Default" transform="translate(-400, -41)">
          <g id="Network-Button" transform="translate(392, 33)" filter="url(#filter-ld1x2nrrzs-1)">
            <g id="coinIcon" transform="translate(8, 8)">
              <g id="Oval">
                <use fill="#25292E" xlinkHref="#path-ld1x2nrrzs-3"></use>
                <use
                  fillOpacity="0.300000012"
                  fill="url(#linearGradient-ld1x2nrrzs-2)"
                  xlinkHref="#path-ld1x2nrrzs-3"
                ></use>
              </g>
              <path
                d="M7.01953125,12.6611328 L11.9995352,15.6073924 L16.9785709,12.6611328 L11.9995352,19.6797342 L7.01953125,12.6611328 Z"
                id="ethLogoBottom"
                fill="url(#linearGradient-ld1x2nrrzs-4)"
              ></path>
              <path
                d="M7.01953125,11.5630045 L11.9995346,3.71972656 L16.979538,11.5630045 L11.9995346,14.509264 L7.01953125,11.5630045 Z"
                id="ethLogoTop"
                fill="#FFFFFF"
                fillRule="nonzero"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
